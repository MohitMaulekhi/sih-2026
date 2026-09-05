import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';

interface RatingStarsProps {
  rating: number;
  reviewsCount?: number;
  showCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewsCount,
  showCount = true,
  size = 'medium',
}) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';
  const iconSize = isSmall ? 10 : isLarge ? 14 : 12;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          isSmall && styles.badgeSmall,
          isLarge && styles.badgeLarge,
        ]}>
        <Star size={iconSize} color="#FFFFFF" fill="#FFFFFF" />
        <Text
          style={[
            styles.ratingText,
            isSmall && styles.ratingTextSmall,
            isLarge && styles.ratingTextLarge,
          ]}>
          {Number(rating).toFixed(1)}
        </Text>
      </View>

      {showCount && reviewsCount !== undefined && (
        <Text
          style={[
            styles.reviewsCountText,
            isSmall && styles.reviewsCountTextSmall,
          ]}>
          ({reviewsCount > 999 ? `${(reviewsCount / 1000).toFixed(1)}k` : reviewsCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  badgeSmall: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeLarge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  ratingTextSmall: {
    fontSize: 10,
  },
  ratingTextLarge: {
    fontSize: 14,
  },
  reviewsCountText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  reviewsCountTextSmall: {
    fontSize: 10,
  },
});
