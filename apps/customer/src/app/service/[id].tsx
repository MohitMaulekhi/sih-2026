import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dbStore } from '@repo/db';
import { Service } from '@repo/types';
import { RatingStars, PriceTag } from '@repo/ui';
import { formatDuration } from '@repo/utils';
import {
  Clock,
  ShieldCheck,
  Zap,
  Check,
  X,
  ArrowRight,
} from 'lucide-react-native';

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
            <View style={styles.categoryBadgeContainer}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {service.category?.name || 'Home Service'}
              </Text>
            </View>
            <RatingStars
              rating={service.rating}
              reviewsCount={service.reviewsCount}
              size="small"
            />
          </View>

          <Text style={styles.serviceTitle}>{service.title}</Text>
          <Text style={styles.shortDescription}>{service.shortDescription}</Text>

          {/* Quick Metrics (Price, Duration, Warranty) */}
          <View style={styles.metricsBox}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Price</Text>
              <Text style={styles.metricPriceText}>
                ₹{finalPrice}
              </Text>
              {service.discountedPrice && (
                <Text style={styles.metricOriginalPrice}>
                  ₹{service.basePrice}
                </Text>
              )}
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <View style={styles.metricValueRow}>
                <Clock size={13} color="#1E293B" style={{ marginRight: 3 }} />
                <Text style={styles.metricValue}>
                  {formatDuration(service.durationMinutes)}
                </Text>
              </View>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Warranty</Text>
              <View style={styles.metricValueRow}>
                <ShieldCheck size={13} color="#1E293B" style={{ marginRight: 3 }} />
                <Text style={styles.metricValue}>30 Days</Text>
              </View>
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
                    <Zap size={14} color="#EA580C" style={{ marginRight: 8 }} />
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
                    <Check size={16} color="#16A34A" style={{ marginRight: 8, marginTop: 1 }} />
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
                    <X size={15} color="#DC2626" style={{ marginRight: 8, marginTop: 1 }} />
                    <Text style={styles.excludedText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* RuralClap Assurance */}
          <View style={styles.assuranceBox}>
            <View style={styles.assuranceHeader}>
              <ShieldCheck size={18} color="#EA580C" style={{ marginRight: 6 }} />
              <Text style={styles.assuranceTitle}>
                RuralClap Service Guarantee
              </Text>
            </View>
            <Text style={styles.assuranceSub}>
              • Background checked & 100% verified professionals{'\n'}
              • Standardized transparent pricing{'\n'}
              • Up to ₹10,000 damage protection cover{'\n'}
              • Free inspection & rework if unsatisfied
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarPriceBox}>
          <Text style={styles.bottomBarPriceLabel}>Total Payable</Text>
          <PriceTag
            price={finalPrice}
            originalPrice={service.discountedPrice ? service.basePrice : null}
            size="medium"
          />
        </View>

        <TouchableOpacity
          style={styles.bookCtaButton}
          activeOpacity={0.85}
          onPress={() => router.push(`/book/${service.id}` as any)}>
          <Text style={styles.bookCtaText}>Book Service</Text>
          <ArrowRight size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
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
    paddingBottom: 130,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#F1F5F9',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryBadgeContainer: {
    flexShrink: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
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
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    marginBottom: 2,
  },
  metricPriceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricOriginalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
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
  },
  featureText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  includedCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    gap: 8,
  },
  includedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  excludedRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  excludedText: {
    fontSize: 13,
    color: '#991B1B',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },
  assuranceBox: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  assuranceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  assuranceTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  assuranceSub: {
    fontSize: 12,
    color: '#C2410C',
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
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' },
    }),
  },
  bottomBarPriceBox: {
    flex: 1,
  },
  bottomBarPriceLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  bookCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
