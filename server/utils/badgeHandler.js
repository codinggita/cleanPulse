const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const Report = require('../models/Report');

const checkAndAwardBadges = async (userId) => {
    try {
        // 1. Get badge definitions
        const badges = await Badge.find();
        
        // 2. Get user's resolved reports count
        const resolvedCount = await Report.countDocuments({ 
            citizenId: userId, 
            status: 'Resolved' 
        });

        // 3. Get user's total reports count
        const totalCount = await Report.countDocuments({ 
            citizenId: userId 
        });

        const awardedThisTurn = [];

        for (const badge of badges) {
            let conditionMet = false;
            
            if (badge.conditionType === 'total_reports' && totalCount >= badge.conditionValue) {
                conditionMet = true;
            } else if (badge.conditionType === 'resolved_reports' && resolvedCount >= badge.conditionValue) {
                conditionMet = true;
            }

            if (conditionMet) {
                // Check if already awarded
                const alreadyEarned = await UserBadge.findOne({ userId, badgeId: badge._id });
                if (!alreadyEarned) {
                    await UserBadge.create({ userId, badgeId: badge._id });
                    awardedThisTurn.push(badge.name);
                }
            }
        }

        return awardedThisTurn;
    } catch (err) {
        console.error('Badge Award Error:', err);
        return [];
    }
};

module.exports = { checkAndAwardBadges };
