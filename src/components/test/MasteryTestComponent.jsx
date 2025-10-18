import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader, Database, Target, Wrench, Calendar, Star } from 'lucide-react';
import masteryService from '../../services/masteryService';
import { useAuth } from '../../contexts/AuthContext';

const MasteryTestComponent = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [testData, setTestData] = useState({
    habitsLibrary: [],
    toolboxLibrary: [],
    userHabits: [],
    userToolbox: [],
    calendarEvents: []
  });

  const addTestResult = (testName, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      testName,
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Database Connection
      setCurrentTest('Testing database connection...');
      const { success, error } = await masteryService.testConnection();
      addTestResult(
        'Database Connection',
        success,
        success ? 'Database connection successful' : `Database connection failed: ${error?.message}`,
        success ? null : error
      );

      if (!success) {
        setIsRunning(false);
        return;
      }

      // Test 2: Get Habits Library
      setCurrentTest('Fetching habits library...');
      const { data: habitsLibrary, error: habitsError } = await masteryService.getHabitsLibrary();
      addTestResult(
        'Habits Library',
        !habitsError,
        habitsError ? `Failed to fetch habits: ${habitsError.message}` : `Successfully fetched ${habitsLibrary.length} habits`,
        habitsLibrary
      );
      setTestData(prev => ({ ...prev, habitsLibrary: habitsLibrary || [] }));

      // Test 3: Get Toolbox Library
      setCurrentTest('Fetching toolbox library...');
      const { data: toolboxLibrary, error: toolboxError } = await masteryService.getToolboxLibrary();
      addTestResult(
        'Toolbox Library',
        !toolboxError,
        toolboxError ? `Failed to fetch toolbox: ${toolboxError.message}` : `Successfully fetched ${toolboxLibrary.length} toolbox items`,
        toolboxLibrary
      );
      setTestData(prev => ({ ...prev, toolboxLibrary: toolboxLibrary || [] }));

      if (!user) {
        addTestResult(
          'User Authentication',
          false,
          'No authenticated user found - skipping user-specific tests',
          null
        );
        setIsRunning(false);
        return;
      }

      // Test 4: Get User Habits
      setCurrentTest('Fetching user habits...');
      const { data: userHabits, error: userHabitsError } = await masteryService.getUserHabits(user.id);
      addTestResult(
        'User Habits',
        !userHabitsError,
        userHabitsError ? `Failed to fetch user habits: ${userHabitsError.message}` : `Successfully fetched ${userHabits.length} user habits`,
        userHabits
      );
      setTestData(prev => ({ ...prev, userHabits: userHabits || [] }));

      // Test 5: Get User Toolbox Items
      setCurrentTest('Fetching user toolbox items...');
      const { data: userToolbox, error: userToolboxError } = await masteryService.getUserToolboxItems(user.id);
      addTestResult(
        'User Toolbox Items',
        !userToolboxError,
        userToolboxError ? `Failed to fetch user toolbox: ${userToolboxError.message}` : `Successfully fetched ${userToolbox.length} user toolbox items`,
        userToolbox
      );
      setTestData(prev => ({ ...prev, userToolbox: userToolbox || [] }));

      // Test 6: Get Calendar Events
      setCurrentTest('Fetching calendar events...');
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const endOfMonth = new Date();
      endOfMonth.setMonth(endOfMonth.getMonth() + 1, 0);
      
      const { data: calendarEvents, error: calendarError } = await masteryService.getCalendarEvents(
        user.id,
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      addTestResult(
        'Calendar Events',
        !calendarError,
        calendarError ? `Failed to fetch calendar events: ${calendarError.message}` : `Successfully fetched ${calendarEvents.length} calendar events`,
        calendarEvents
      );
      setTestData(prev => ({ ...prev, calendarEvents: calendarEvents || [] }));

      // Test 7: Add Habit from Library (if habits exist)
      if (habitsLibrary && habitsLibrary.length > 0) {
        setCurrentTest('Testing habit addition...');
        const firstHabit = habitsLibrary[0];
        const { data: addedHabit, error: addHabitError } = await masteryService.addHabitFromLibrary(user.id, firstHabit.id);
        addTestResult(
          'Add Habit from Library',
          !addHabitError,
          addHabitError ? `Failed to add habit: ${addHabitError.message}` : `Successfully added habit: ${firstHabit.title}`,
          addedHabit
        );
      }

      // Test 8: Add Toolbox Item (if toolbox items exist)
      if (toolboxLibrary && toolboxLibrary.length > 0) {
        setCurrentTest('Testing toolbox item addition...');
        const firstToolboxItem = toolboxLibrary[0];
        const { data: addedToolboxItem, error: addToolboxError } = await masteryService.addToolboxItem(user.id, firstToolboxItem.id);
        addTestResult(
          'Add Toolbox Item',
          !addToolboxError,
          addToolboxError ? `Failed to add toolbox item: ${addToolboxError.message}` : `Successfully added toolbox item: ${firstToolboxItem.title}`,
          addedToolboxItem
        );
      }

      // Test 9: Create Custom Habit
      setCurrentTest('Testing custom habit creation...');
      const customHabitData = {
        title: 'Test Custom Habit',
        description: 'This is a test custom habit created by the test suite',
        frequency_type: 'daily',
        xp_reward: 15,
        skill_tags: ['test', 'automation']
      };
      const { data: customHabit, error: customHabitError } = await masteryService.createCustomHabit(user.id, customHabitData);
      addTestResult(
        'Create Custom Habit',
        !customHabitError,
        customHabitError ? `Failed to create custom habit: ${customHabitError.message}` : `Successfully created custom habit: ${customHabitData.title}`,
        customHabit
      );

      // Test 10: Complete Habit (if we have habits)
      if (userHabits && userHabits.length > 0) {
        setCurrentTest('Testing habit completion...');
        const firstUserHabit = userHabits[0];
        const { data: completion, error: completionError } = await masteryService.completeHabit(user.id, firstUserHabit.id);
        addTestResult(
          'Complete Habit',
          !completionError,
          completionError ? `Failed to complete habit: ${completionError.message}` : `Successfully completed habit: ${firstUserHabit.title}`,
          completion
        );
      }

      // Test 11: Calculate Streak (if we have habits)
      if (userHabits && userHabits.length > 0) {
        setCurrentTest('Testing streak calculation...');
        const firstUserHabit = userHabits[0];
        const { data: streak, error: streakError } = await masteryService.calculateHabitStreak(user.id, firstUserHabit.id);
        addTestResult(
          'Calculate Habit Streak',
          !streakError,
          streakError ? `Failed to calculate streak: ${streakError.message}` : `Successfully calculated streak: ${streak} days`,
          { streak }
        );
      }

      addTestResult(
        'All Tests Complete',
        true,
        `Successfully completed ${testResults.length + 1} tests`,
        null
      );

    } catch (error) {
      addTestResult(
        'Test Suite Error',
        false,
        `Test suite failed with error: ${error.message}`,
        error
      );
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setTestData({
      habitsLibrary: [],
      toolboxLibrary: [],
      userHabits: [],
      userToolbox: [],
      calendarEvents: []
    });
  };

  const getSuccessCount = () => testResults.filter(result => result.success).length;
  const getFailureCount = () => testResults.filter(result => !result.success).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Database className="text-blue-600" />
              <span>Mastery System Test Suite</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive testing of habits, toolbox, and calendar functionality
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={clearResults}
              disabled={isRunning}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Results
            </button>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isRunning ? <Loader className="animate-spin" size={16} /> : <Database size={16} />}
              <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
            </button>
          </div>
        </div>

        {/* Current Test Status */}
        {isRunning && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <Loader className="animate-spin text-blue-600" size={20} />
              <span className="text-blue-800 dark:text-blue-200 font-medium">{currentTest}</span>
            </div>
          </div>
        )}

        {/* Test Summary */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testResults.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Tests</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{getSuccessCount()}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Passed</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{getFailureCount()}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Failed</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {testResults.length > 0 ? Math.round((getSuccessCount() / testResults.length) * 100) : 0}%
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Success Rate</div>
            </div>
          </div>
        )}

        {/* Test Results */}
        <div className="space-y-3">
          {testResults.map((result) => (
            <div
              key={result.id}
              className={`border rounded-lg p-4 ${
                result.success
                  ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="text-green-600 dark:text-green-400 mt-0.5" size={20} />
                  ) : (
                    <XCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{result.testName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                          View Data
                        </summary>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Data Summary */}
        {testData.habitsLibrary.length > 0 || testData.toolboxLibrary.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Habits Library</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testData.habitsLibrary.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available habits</div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wrench className="text-purple-600" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Toolbox Library</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testData.toolboxLibrary.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Available tools</div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="text-green-600" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">User Habits</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testData.userHabits.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active habits</div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="text-orange-600" size={20} />
                <span className="font-semibold text-gray-900 dark:text-white">Calendar Events</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{testData.calendarEvents.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">This month</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MasteryTestComponent;
