import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dbStore } from '@repo/db';
import { Service } from '@repo/types';
import { RatingStars, PriceTag } from '@repo/ui';
import { formatDuration } from '@repo/utils';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    if (id) {
      const found = dbStore.getServiceById(id);
      if (found) {
        setService(found);
      }
    }
  }, [id]);

  if (!service) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading service details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const finalPrice = service.discountedPrice ?? service.basePrice;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Main Hero Image */}
        <Image source={{ uri: service.imageUrl }} style={styles.heroImage} />

        <View style={styles.contentContainer}>
          {/* Header & Rating */}
          <View style={styles.categoryRow}>
            <Text style={styles.categoryText}>
              {service.category?.name || 'Home Service'}
            </Text>
            <RatingStars
              rating={service.rating}
              reviewsCount={service.reviewsCount}
              size="medium"
            />
          </View>

          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.shortDescription}>{service.shortDescription}</Text>

          {/* Quick Metrics (Price, Duration, Warranty) */}
          <View style={styles.metricsBox}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Price</Text>
              <PriceTag
                price={finalPrice}
                originalPrice={service.discountedPrice ? service.basePrice : null}
                size="large"
              />
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <Text style={styles.metricValue}>
                ⏱️ {formatDuration(service.durationMinutes)}
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Warranty</Text>
              <Text style={styles.metricValue}>🛡️ 30 Days</Text>
            </View>
          </View>

          {/* Full Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.fullDescText}>{service.fullDescription}</Text>
          </View>

          {/* Features Highlights */}
          {service.features && service.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              <View style={styles.featuresContainer}>
                {service.features.map((feat, idx) => (
                  <View key={idx} style={styles.featureRow}>
                    <Text style={styles.featureIcon}>⚡</Text>
                    <Text style={styles.featureText}>{feat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* What's Included */}
          {service.whatsIncluded && service.whatsIncluded.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's Included</Text>
              <View style={styles.includedCard}>
                {service.whatsIncluded.map((item, idx) => (
                  <View key={idx} style={styles.includedRow}>
                    <Text style={styles.checkIcon}>✓</Text>
                    <Text style={styles.includedText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* What's Excluded */}
          {service.whatsExcluded && service.whatsExcluded.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's Excluded</Text>
              <View style={styles.excludedCard}>
                {service.whatsExcluded.map((item, idx) => (
                  <View key={idx} style={styles.excludedRow}>
                    <Text style={styles.crossIcon}>✕</Text>
                    <Text style={styles.excludedText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Urban Company Assurance */}
          <View style={styles.assuranceBox}>
            <Text style={styles.assuranceTitle}>
              Urban Company Service Guarantee
            </Text>
            <Text style={styles.assuranceSub}>
              • Background checked & 100% vaccinated professionals{'\n'}
              • Standardized transparent pricing{'\n'}
              • Up to ₹10,000 damage insurance cover{'\n'}
              • Free inspection / rework if you are unsatisfied
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomBarPriceLabel}>Total Amount</Text>
          <PriceTag
            price={finalPrice}
            originalPrice={service.discountedPrice ? service.basePrice : null}
            size="large"
          />
        </View>

        <TouchableOpacity
          style={styles.bookCtaButton}
          activeOpacity={0.85}
          onPress={() => router.push(`/book/${service.id}`)}>
          <Text style={styles.bookCtaText}>Book Service ➔</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  contentContainer: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#7C3AED',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 6,
  },
  shortDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  metricsBox: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  fullDescText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  includedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 10,
  },
  includedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    color: '#16A34A',
    fontSize: 15,
    fontWeight: '900',
  },
  includedText: {
    fontSize: 13,
    color: '#166534',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  excludedCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 10,
  },
  excludedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  crossIcon: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '900',
  },
  excludedText: {
    fontSize: 13,
    color: '#991B1B',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  assuranceBox: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  assuranceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#6B21A8',
    marginBottom: 6,
  },
  assuranceSub: {
    fontSize: 12,
    color: '#7E22CE',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' },
    }),
  },
  bottomBarPriceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bookCtaButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
