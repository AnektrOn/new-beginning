import { supabase } from '../lib/supabaseClient';

class SkillsService {
  /**
   * Get all skills from the database
   */
  async getAllSkills() {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          master_stats (
            id,
            name,
            display_name,
            color
          )
        `)
        .order('display_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching skills:', error);
      return { data: null, error };
    }
  }

  /**
   * Get skills by IDs (for skill_tags arrays)
   */
  async getSkillsByIds(skillIds) {
    try {
      if (!skillIds || skillIds.length === 0) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('skills')
        .select(`
          *,
          master_stats (
            id,
            name,
            display_name,
            color
          )
        `)
        .in('id', skillIds);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching skills by IDs:', error);
      return { data: null, error };
    }
  }

  /**
   * Get all master stats
   */
  async getMasterStats() {
    try {
      const { data, error } = await supabase
        .from('master_stats')
        .select('*')
        .order('display_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching master stats:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's skill progress for all skills
   */
  async getUserSkills(userId) {
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select(`
          *,
          skills (
            id,
            name,
            display_name,
            description,
            max_value,
            master_stat_id,
            master_stats (
              id,
              name,
              display_name,
              color
            )
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user skills:', error);
      return { data: null, error };
    }
  }

  /**
   * Get user's progress for specific skills
   */
  async getUserSkillsByIds(userId, skillIds) {
    try {
      if (!skillIds || skillIds.length === 0) {
        return { data: [], error: null };
      }

      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', userId)
        .in('skill_id', skillIds);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user skills by IDs:', error);
      return { data: null, error };
    }
  }

  /**
   * Award skill points to multiple skills
   * @param {string} userId - User ID
   * @param {string[]} skillIds - Array of skill IDs
   * @param {number} pointsPerSkill - Points to award to each skill (0.1 for habits, 0.15 for toolbox)
   */
  async awardSkillPoints(userId, skillIds, pointsPerSkill) {
    try {
      if (!skillIds || skillIds.length === 0) {
        return { data: null, error: new Error('No skill IDs provided') };
      }

      console.log(`🎯 Awarding ${pointsPerSkill} points to ${skillIds.length} skills for user ${userId}`);

      // Get current user_skills records
      const { data: existingSkills, error: fetchError } = await this.getUserSkillsByIds(userId, skillIds);
      if (fetchError) throw fetchError;

      // Create a map of existing skills
      const existingSkillsMap = new Map(
        (existingSkills || []).map(skill => [skill.skill_id, skill])
      );

      // Prepare updates and inserts
      const updates = [];
      const inserts = [];

      for (const skillId of skillIds) {
        const existing = existingSkillsMap.get(skillId);
        
        if (existing) {
          // Update existing record
          const newValue = Math.min(100, (existing.current_value || 0) + pointsPerSkill);
          updates.push({
            id: existing.id,
            current_value: newValue,
            updated_at: new Date().toISOString()
          });
        } else {
          // Insert new record
          inserts.push({
            user_id: userId,
            skill_id: skillId,
            current_value: pointsPerSkill
          });
        }
      }

      // Execute updates
      if (updates.length > 0) {
        for (const update of updates) {
          const { error: updateError } = await supabase
            .from('user_skills')
            .update({
              current_value: update.current_value,
              updated_at: update.updated_at
            })
            .eq('id', update.id);

          if (updateError) {
            console.error('Error updating skill:', updateError);
          } else {
            console.log(`✅ Updated skill ${update.id}: ${update.current_value}`);
          }
        }
      }

      // Execute inserts
      if (inserts.length > 0) {
        const { error: insertError } = await supabase
          .from('user_skills')
          .insert(inserts);

        if (insertError) {
          console.error('Error inserting skills:', insertError);
          throw insertError;
        } else {
          console.log(`✅ Inserted ${inserts.length} new skill records`);
        }
      }

      return { 
        data: { 
          updated: updates.length, 
          inserted: inserts.length 
        }, 
        error: null 
      };
    } catch (error) {
      console.error('Error awarding skill points:', error);
      return { data: null, error };
    }
  }

  /**
   * Get skills grouped by master stat
   */
  async getSkillsGroupedByMasterStat() {
    try {
      const { data: skills, error: skillsError } = await this.getAllSkills();
      if (skillsError) throw skillsError;

      // Group skills by master stat
      const grouped = {};
      
      for (const skill of skills || []) {
        const masterStatId = skill.master_stat_id;
        
        if (!grouped[masterStatId]) {
          grouped[masterStatId] = {
            masterStat: skill.master_stats,
            skills: []
          };
        }
        
        grouped[masterStatId].skills.push(skill);
      }

      return { data: grouped, error: null };
    } catch (error) {
      console.error('Error grouping skills by master stat:', error);
      return { data: null, error };
    }
  }

  /**
   * Test the skills system
   */
  async testSkillsSystem() {
    try {
      console.log('🧪 Testing Skills System...\n');

      // Test 1: Get all skills
      console.log('1. Fetching all skills...');
      const { data: skills, error: skillsError } = await this.getAllSkills();
      if (skillsError) throw skillsError;
      console.log(`✅ Found ${skills.length} skills`);

      // Test 2: Get master stats
      console.log('\n2. Fetching master stats...');
      const { data: masterStats, error: masterStatsError } = await this.getMasterStats();
      if (masterStatsError) throw masterStatsError;
      console.log(`✅ Found ${masterStats.length} master stats:`, masterStats.map(m => m.display_name));

      // Test 3: Test with current user (if authenticated)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log(`\n3. Testing with user: ${user.email}`);
        
        // Get user skills
        console.log('Fetching user skills...');
        const { data: userSkills, error: userSkillsError } = await this.getUserSkills(user.id);
        if (userSkillsError) throw userSkillsError;
        console.log(`✅ User has progress in ${userSkills.length} skills`);

        // Test awarding skill points
        console.log('\n4. Testing skill point award...');
        const testSkillIds = [skills[0].id]; // Use first skill for test
        const { data: awardResult, error: awardError } = await this.awardSkillPoints(user.id, testSkillIds, 0.1);
        if (awardError) throw awardError;
        console.log('✅ Skill points awarded:', awardResult);
      } else {
        console.log('\n⚠️ No authenticated user, skipping user-specific tests');
      }

      console.log('\n✅ Skills system test complete!');
      return { success: true };
    } catch (error) {
      console.error('❌ Skills system test failed:', error);
      return { success: false, error };
    }
  }

  /**
   * Get user's master stats progress
   */
  async getUserMasterStats(userId) {
    try {
      const { data, error } = await supabase
        .from('master_stats')
        .select(`
          *,
          user_master_stats!inner (
            current_value
          )
        `)
        .eq('user_master_stats.user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user master stats:', error);
      return { data: null, error };
    }
  }
}

// Export singleton instance
const skillsService = new SkillsService();
export default skillsService;

