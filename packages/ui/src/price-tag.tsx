import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '@repo/utils';

interface PriceTagProps {
  price: number;
  originalPrice?: number | null;
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'medium',
  color = '#0F172A',
}) => {
  const isSmall = size === 'small';
  const isLarge = size === 'large';

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.currentPrice,
          { color },
          isSmall && styles.currentPriceSmall,
          isLarge && styles.currentPriceLarge,
        ]}>
        {formatCurrency(price)}
      </Text>

      {hasDiscount && (
        <Text
          style={[
            styles.originalPrice,
            isSmall && styles.originalPriceSmall,
            isLarge && styles.originalPriceLarge,
          ]}>
          {formatCurrency(originalPrice)}
        </Text>
      )}

      {hasDiscount && discountPercent > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discountPercent}% OFF</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  currentPriceSmall: {
    fontSize: 14,
  },
  currentPriceLarge: {
    fontSize: 22,
  },
  originalPrice: {
    fontSize: 13,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  originalPriceSmall: {
    fontSize: 11,
  },
  originalPriceLarge: {
    fontSize: 15,
  },
  discountBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
  },
});
