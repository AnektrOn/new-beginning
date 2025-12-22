import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import courseService from '../../services/courseService';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Global SearchBar Component
 * Provides quick search across courses, content, and users
 * Supports keyboard shortcuts (Cmd/Ctrl + K)
 */
const SearchBar = ({ 
  className,
  variant = 'default', // 'default', 'compact', 'header'
  onSelect,
  placeholder = 'Search courses, content...'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    try {
      // Search courses
      const { data: courses, error } = await courseService.getAllCourses();
      
      if (!error && courses) {
        const filtered = courses.filter(course => 
          course.course_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.masterschool?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

        setResults(filtered.map(course => ({
          type: 'course',
          id: course.id,
          title: course.course_title,
          subtitle: course.masterschool,
          metadata: course.topic,
          action: () => {
            navigate(`/courses/${course.id}`);
            setIsOpen(false);
            if (onSelect) onSelect(course);
          }
        })));
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result) => {
    // Save to recent searches
    const updated = [
      { query: result.title, type: result.type, timestamp: Date.now() },
      ...recentSearches.filter(s => s.query !== result.title)
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    result.action();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)} ref={containerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="pl-9 pr-9 h-9 text-sm"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {isOpen && (
          <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto glass-effect-enhanced border-slate-600/50">
            <CardContent className="p-2">
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                </div>
              ) : query && results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(result)}
                      className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors focus-ring"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">{result.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          {result.subtitle && (
                            <p className="text-xs text-slate-400">{result.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query && !loading ? (
                <div className="p-4 text-center text-slate-400 text-sm">
                  No results found
                </div>
              ) : recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2 px-2">
                    <span className="text-xs text-slate-400">Recent searches</span>
                    <button
                      onClick={clearRecent}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(search.query)}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-300"
                      >
                        {search.query}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 text-sm">
                  Start typing to search...
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-ring"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto glass-effect-enhanced border-slate-600/50 shadow-xl">
          <CardContent className="p-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : query && results.length > 0 ? (
              <div className="space-y-2">
                {results.map((result, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-700/50 transition-colors focus-ring"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white">{result.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        {result.subtitle && (
                          <p className="text-sm text-slate-400">{result.subtitle}</p>
                        )}
                        {result.metadata && (
                          <p className="text-xs text-slate-500 mt-1">{result.metadata}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm">No results found for "{query}"</p>
              </div>
            ) : recentSearches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300">Recent searches</span>
                  <button
                    onClick={clearRecent}
                    className="text-xs text-slate-500 hover:text-slate-300 focus-ring"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(search.query)}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-sm text-slate-300 focus-ring"
                    >
                      {search.query}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <p className="text-sm mb-2">Start typing to search courses...</p>
                <p className="text-xs text-slate-500">Press Cmd+K (Mac) or Ctrl+K (Windows) to open search</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;

