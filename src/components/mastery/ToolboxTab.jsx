import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Target, Trash2 } from 'lucide-react';

const ToolboxTab = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [toolboxLibrary, setToolboxLibrary] = useState([]);
  const [userToolbox, setUserToolbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [conversionData, setConversionData] = useState({
    frequency_type: 'daily',
    xp_reward: 15
  });

  // Load toolbox data
  useEffect(() => {
    const loadToolbox = async () => {
      setLoading(true);
      try {
        // TODO: Implement API calls to fetch toolbox data
        // For now, using mock data
        const mockToolboxLibrary = [
          {
            id: '1',
            title: 'Pomodoro Technique',
            description: 'Time management method using 25-minute focused work sessions',
            category: 'cognitive',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '2',
            title: 'Mind Mapping',
            description: 'Visual technique for organizing thoughts and ideas',
            category: 'cognitive',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '3',
            title: 'Body Scan Meditation',
            description: 'Mindfulness practice focusing on physical sensations',
            category: 'spiritual',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          },
          {
            id: '4',
            title: 'Active Listening',
            description: 'Communication technique focused on understanding others',
            category: 'social',
            xp_reward: 15,
            can_convert_to_habit: true,
            difficulty_level: 2
          }
        ];

        const mockUserToolbox = [
          {
            id: '1',
            toolbox_id: '1',
            title: 'Pomodoro Technique',
            description: 'Time management method using 25-minute focused work sessions',
            is_active: true,
            converted_to_habit_id: null
          }
        ];

        setToolboxLibrary(mockToolboxLibrary);
        setUserToolbox(mockUserToolbox);
      } catch (error) {
        console.error('Error loading toolbox:', error);
      } finally {
        setLoading(false);
      }
    };

    loadToolbox();
  }, []);

  // Add tool to user toolbox
  const addToolToUser = async (tool) => {
    try {
      // TODO: Implement API call to add tool to user toolbox
      console.log('Adding tool to user toolbox:', tool);
      
      const userTool = {
        id: `user_${Date.now()}`,
        toolbox_id: tool.id,
        title: tool.title,
        description: tool.description,
        is_active: true,
        converted_to_habit_id: null
      };
      
      setUserToolbox([...userToolbox, userTool]);
    } catch (error) {
      console.error('Error adding tool:', error);
    }
  };

  // Convert tool to habit
  const convertToolToHabit = async () => {
    try {
      // TODO: Implement API call to convert tool to habit
      console.log('Converting tool to habit:', selectedTool, conversionData);
      
      // Update user toolbox item
      setUserToolbox(userToolbox.map(tool => 
        tool.toolbox_id === selectedTool.id 
          ? { ...tool, converted_to_habit_id: `habit_${Date.now()}` }
          : tool
      ));
      
      setShowConvertModal(false);
      setSelectedTool(null);
    } catch (error) {
      console.error('Error converting tool:', error);
    }
  };

  // Remove tool from user toolbox
  const removeTool = async (toolId) => {
    try {
      // TODO: Implement API call to remove tool
      console.log('Removing tool:', toolId);
      
      setUserToolbox(userToolbox.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Error removing tool:', error);
    }
  };

  // Check if tool is already in user toolbox
  const isToolInUserToolbox = (toolId) => {
    return userToolbox.some(tool => tool.toolbox_id === toolId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="glass-tab-navigation">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab('library')}
            className={`glass-tab-btn ${activeTab === 'library' ? 'glass-tab-btn-active' : ''}`}
          >
            <Wrench size={20} className="mr-2" />
            Library ({toolboxLibrary.length})
          </button>
          <button
            onClick={() => setActiveTab('my-toolbox')}
            className={`glass-tab-btn ${activeTab === 'my-toolbox' ? 'glass-tab-btn-active' : ''}`}
          >
            <Target size={20} className="mr-2" />
            My Toolbox ({userToolbox.length})
          </button>
        </nav>
      </div>

      {/* Toolbox Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Learning Tools Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover powerful learning tools and techniques. Add them to your toolbox or convert them into habits.
          </p>
          
          <div className="grid gap-4">
            {toolboxLibrary.map(tool => (
              <div key={tool.id} className="glass-toolbox-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <span className="glass-difficulty-badge">
                        Level {tool.difficulty_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {tool.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        +{tool.xp_reward} XP
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {tool.category}
                      </span>
                      {tool.can_convert_to_habit && (
                        <span className="text-xs text-green-600 dark:text-green-400">
                          Convertible to Habit
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {!isToolInUserToolbox(tool.id) ? (
                      <button
                        onClick={() => addToolToUser(tool)}
                        className="glass-primary-btn"
                      >
                        <Plus size={16} className="mr-2" />
                        Add to Toolbox
                      </button>
                    ) : (
                      <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                        ✓ In Your Toolbox
                      </span>
                    )}
                    {tool.can_convert_to_habit && (
                      <button
                        onClick={() => {
                          setSelectedTool(tool);
                          setShowConvertModal(true);
                        }}
                        className="glass-secondary-btn"
                      >
                        <Target size={16} className="mr-2" />
                        Convert to Habit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Toolbox Tab */}
      {activeTab === 'my-toolbox' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Toolbox
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your personal collection of learning tools and techniques.
          </p>
          
          <div className="grid gap-4">
            {userToolbox.map(tool => (
              <div key={tool.id} className="glass-toolbox-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        {tool.converted_to_habit_id ? (
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            ✓ Converted to Habit
                          </span>
                        ) : (
                          <span className="text-xs text-orange-600 dark:text-orange-400">
                            Available as Tool
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!tool.converted_to_habit_id && (
                      <button
                        onClick={() => {
                          const libraryTool = toolboxLibrary.find(t => t.id === tool.toolbox_id);
                          if (libraryTool) {
                            setSelectedTool(libraryTool);
                            setShowConvertModal(true);
                          }
                        }}
                        className="glass-primary-btn"
                      >
                        <Target size={16} className="mr-2" />
                        Convert to Habit
                      </button>
                    )}
                    <button
                      onClick={() => removeTool(tool.id)}
                      className="glass-delete-btn"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {userToolbox.length === 0 && (
            <div className="glass-card p-8 text-center">
              <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Your toolbox is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start building your learning toolkit by exploring the library.
              </p>
              <button
                onClick={() => setActiveTab('library')}
                className="glass-primary-btn"
              >
                Browse Library
              </button>
            </div>
          )}
        </div>
      )}

      {/* Convert to Habit Modal */}
      {showConvertModal && selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-modal">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Convert "{selectedTool.title}" to Habit
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {selectedTool.description}
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select
                  value={conversionData.frequency_type}
                  onChange={(e) => setConversionData({ ...conversionData, frequency_type: e.target.value })}
                  className="glass-input"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  XP Reward
                </label>
                <input
                  type="number"
                  value={conversionData.xp_reward}
                  onChange={(e) => setConversionData({ ...conversionData, xp_reward: parseInt(e.target.value) })}
                  className="glass-input"
                  min="1"
                  max="100"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={convertToolToHabit}
                className="glass-primary-btn"
              >
                Convert to Habit
              </button>
              <button
                onClick={() => {
                  setShowConvertModal(false);
                  setSelectedTool(null);
                }}
                className="glass-secondary-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolboxTab;
