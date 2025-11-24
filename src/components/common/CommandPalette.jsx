import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Home, 
  User, 
  Target, 
  BookOpen, 
  Users, 
  Settings,
  Plus,
  Calendar,
  Command
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CommandPalette Component
 * Quick action menu accessible via Cmd/Ctrl + K
 * Provides fast navigation and actions
 */
const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const commands = [
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      icon: Home,
      shortcut: 'D',
      action: () => navigate('/dashboard'),
      category: 'Navigation'
    },
    {
      id: 'profile',
      label: 'Go to Profile',
      icon: User,
      shortcut: 'P',
      action: () => navigate('/profile'),
      category: 'Navigation'
    },
    {
      id: 'mastery',
      label: 'Go to Mastery',
      icon: Target,
      shortcut: 'M',
      action: () => navigate('/mastery'),
      category: 'Navigation'
    },
    {
      id: 'courses',
      label: 'Go to Courses',
      icon: BookOpen,
      shortcut: 'C',
      action: () => navigate('/courses'),
      category: 'Navigation'
    },
    {
      id: 'community',
      label: 'Go to Community',
      icon: Users,
      shortcut: 'U',
      action: () => navigate('/community'),
      category: 'Navigation'
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      icon: Settings,
      shortcut: 'S',
      action: () => navigate('/settings'),
      category: 'Navigation'
    },
    {
      id: 'create-post',
      label: 'Create Post',
      icon: Plus,
      shortcut: 'N',
      action: () => {
        navigate('/community');
        // Trigger create post modal (would need to be implemented)
      },
      category: 'Actions'
    },
    {
      id: 'create-course',
      label: 'Create Course',
      icon: Plus,
      shortcut: 'K',
      action: () => navigate('/courses/create'),
      category: 'Actions'
    },
  ];

  const filteredCommands = query
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        setOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filteredCommands]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (command) => {
    command.action();
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl p-0 glass-effect-enhanced border-slate-600/50">
        <div className="p-4 border-b border-slate-600/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-20 bg-slate-800/50 border-slate-600/50 text-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="kbd-shortcut">Esc</kbd>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2" ref={resultsRef}>
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="mb-4">
              <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {category}
              </div>
              <div className="space-y-1">
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd);
                  const Icon = cmd.icon;
                  const isSelected = globalIndex === selectedIndex;
                  
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors focus-ring',
                        isSelected 
                          ? 'bg-slate-700/50 text-white' 
                          : 'text-slate-300 hover:bg-slate-700/30'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" aria-hidden="true" />
                        <span className="font-medium">{cmd.label}</span>
                      </div>
                      {cmd.shortcut && (
                        <kbd className="kbd-shortcut">{cmd.shortcut}</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredCommands.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              <p className="text-sm">No commands found</p>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-600/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="kbd-shortcut">↑</kbd>
              <kbd className="kbd-shortcut">↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="kbd-shortcut">Enter</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <kbd className="kbd-shortcut">K</kbd>
            <span>Open</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommandPalette;

