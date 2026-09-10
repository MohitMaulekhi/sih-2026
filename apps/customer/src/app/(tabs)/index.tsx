import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { dbStore } from '@repo/db';
import { Service, ServiceCategory } from '@repo/types';
import { useAuth } from '@repo/auth';
import {
  RatingStars,
  PriceTag,
  SectionHeader,
  IconHelper,
} from '@repo/ui';
import { formatDuration } from '@repo/utils';
import { useTranslation } from '@repo/i18n';
import {
  MapPin,
  ChevronDown,
  Search,
  X,
  Zap,
  ArrowRight,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react-native';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = () => {
      setCategories(dbStore.getCategories());
      setPopularServices(dbStore.getServices({ isPopular: true }));
      setAllServices(dbStore.getServices());
    };

    loadData();
    const unsubscribe = dbStore.subscribe(loadData);
    return unsubscribe;
  }, []);

  const filteredServices = selectedCategory
    ? allServices.filter(
        (s) =>
          s.categoryId === selectedCategory ||
          s.category?.slug === selectedCategory
      )
    : allServices;

  const searchFiltered = searchQuery.trim()
    ? filteredServices.filter((s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredServices;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationLabel}>{t('customer.home.deliveringTo')}</Text>
            <TouchableOpacity
              style={styles.locationRow}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/profile' as any)}>
              <MapPin size={14} color="#EA580C" style={{ marginRight: 4 }} />
              <Text style={styles.locationCity}>
                {user?.city || 'Bengaluru'}
              </Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                • {user?.address ? 'Home' : 'Indiranagar 100ft Rd'}
              </Text>
              <ChevronDown size={14} color="#64748B" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/(tabs)/profile' as any)}
            activeOpacity={0.8}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>
                  {user?.fullName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('customer.home.searchPlaceholder')}
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" style={styles.clearSearch} />
            </TouchableOpacity>
          )}
        </View>

        {/* Promotional Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <Text style={styles.heroHeading}>{t('customer.home.heroHeading')}</Text>
            <Text style={styles.heroSubtitle}>
              {t('customer.home.heroSubtitle')}
            </Text>
            <TouchableOpacity
              style={styles.heroCta}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory('a0000000-0000-0000-0000-000000000001')}>
              <Text style={styles.heroCtaText}>{t('customer.home.exploreOffers')}</Text>
              <ArrowRight size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
            }}
            style={styles.heroImage}
          />
        </View>

        {/* Category Icons Grid */}
        <SectionHeader
          icon={<Sparkles size={18} color="#EA580C" />}
          title={t('customer.home.categories')}
          subtitle={t('customer.home.categoriesSubtitle')}
          actionText={selectedCategory ? t('customer.home.clearFilter') : undefined}
          onActionPress={() => setSelectedCategory(null)}
        />

        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  setSelectedCategory(isSelected ? null : cat.id)
                }>
                <View
                  style={[
                    styles.categoryIconCircle,
                    isSelected && styles.categoryIconCircleSelected,
                  ]}>
                  <IconHelper
                    name={cat.icon}
                    size={22}
                    color={isSelected ? '#FFFFFF' : '#EA580C'}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    isSelected && styles.categoryNameSelected,
                  ]}
                  numberOfLines={2}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Most Booked / Popular Services Section */}
        {!selectedCategory && searchQuery.length === 0 && (
          <>
            <SectionHeader
              icon={<Flame size={18} color="#EA580C" />}
              title={t('customer.home.mostBooked')}
              subtitle={t('customer.home.mostBookedSubtitle')}
              actionText={t('common.viewAll')}
              onActionPress={() => router.push('/(tabs)/explore' as any)}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularRow}>
              {popularServices.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.popularCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/service/${service.id}` as any)}>
                  <Image
                    source={{ uri: service.imageUrl }}
                    style={styles.popularCardImage}
                  />
                  <View style={styles.popularCardContent}>
                    <View style={styles.popularCardHeader}>
                      <RatingStars
                        rating={service.rating}
                        reviewsCount={service.reviewsCount}
                        size="small"
                      />
                      <View style={styles.durationRow}>
                        <Clock size={11} color="#64748B" style={{ marginRight: 3 }} />
                        <Text style={styles.durationBadge}>
                          {formatDuration(service.durationMinutes)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.popularCardTitle} numberOfLines={2}>
                      {service.title}
                    </Text>

                    <View style={styles.popularCardFooter}>
                      <PriceTag
                        price={service.discountedPrice ?? service.basePrice}
                        originalPrice={service.discountedPrice ? service.basePrice : null}
                        size="small"
                      />
                      <TouchableOpacity
                        style={styles.bookMiniBtn}
                        onPress={() => router.push(`/book/${service.id}` as any)}>
                        <Text style={styles.bookMiniBtnText}>{t('common.book')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* All Services / Filtered Services Grid */}
        <SectionHeader
          icon={<Award size={18} color="#EA580C" />}
          title={
            selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Filtered'} Services`
              : searchQuery
                ? `Results for "${searchQuery}"`
                : t('customer.home.allServices')
          }
          subtitle={t('customer.home.topRatedSubtitle')}
        />

        <View style={styles.servicesList}>
          {searchFiltered.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItemCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/service/${service.id}` as any)}>
              <Image
                source={{ uri: service.imageUrl }}
                style={styles.serviceItemImage}
              />
              <View style={styles.serviceItemBody}>
                <View style={styles.serviceItemTop}>
                  <RatingStars
                    rating={service.rating}
                    reviewsCount={service.reviewsCount}
                    size="small"
                  />
                  {service.isPopular && (
                    <View style={styles.trendingBadge}>
                      <Text style={styles.trendingBadgeText}>{t('customer.home.bestseller')}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.serviceItemTitle} numberOfLines={2}>
                  {service.title}
                </Text>
                <Text style={styles.serviceItemDesc} numberOfLines={2}>
                  {service.shortDescription}
                </Text>

                <View style={styles.serviceItemBottom}>
                  <View style={styles.priceContainer}>
                    <PriceTag
                      price={service.discountedPrice ?? service.basePrice}
                      originalPrice={service.discountedPrice ? service.basePrice : null}
                      size="small"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.bookButton}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/book/${service.id}` as any)}>
                    <Text style={styles.bookButtonText}>{t('common.book')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust Badges Section */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>{t('customer.home.promiseTitle')}</Text>
          <View style={styles.trustGrid}>
            <View style={styles.trustItem}>
              <ShieldCheck size={26} color="#EA580C" style={styles.trustIcon} />
              <Text style={styles.trustHeading}>{t('customer.home.trustVerified')}</Text>
              <Text style={styles.trustSub}>{t('customer.home.trustVerifiedSub')}</Text>
            </View>
            <View style={styles.trustItem}>
              <Clock size={26} color="#EA580C" style={styles.trustIcon} />
              <Text style={styles.trustHeading}>{t('customer.home.trustOnTime')}</Text>
              <Text style={styles.trustSub}>{t('customer.home.trustOnTimeSub')}</Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle2 size={26} color="#EA580C" style={styles.trustIcon} />
              <Text style={styles.trustHeading}>{t('customer.home.trustCover')}</Text>
              <Text style={styles.trustSub}>{t('customer.home.trustCoverSub')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationCity: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  locationAddress: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 4,
    maxWidth: 160,
  },
  avatarButton: {
    marginLeft: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#EA580C',
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#EA580C',
    fontWeight: '800',
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearch: {
    paddingHorizontal: 4,
  },
  heroBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  heroContent: {
    flex: 1,
    paddingRight: 10,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 88, 12, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 146, 60, 0.4)',
  },
  heroBadgeText: {
    color: '#FED7AA',
    fontSize: 10,
    fontWeight: '800',
  },
  heroHeading: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 16,
  },
  categoryCard: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryCardSelected: {
    backgroundColor: '#FFEDD5',
    borderColor: '#EA580C',
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)' },
    }),
  },
  categoryIconCircleSelected: {
    backgroundColor: '#EA580C',
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  categoryNameSelected: {
    color: '#EA580C',
    fontWeight: '800',
  },
  popularRow: {
    gap: 14,
    paddingVertical: 6,
    paddingRight: 16,
  },
  popularCard: {
    width: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)' },
    }),
  },
  popularCardImage: {
    width: '100%',
    height: 115,
  },
  popularCardContent: {
    padding: 12,
  },
  popularCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationBadge: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  popularCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
    minHeight: 38,
  },
  popularCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookMiniBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  bookMiniBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  servicesList: {
    gap: 14,
    marginBottom: 24,
  },
  serviceItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    gap: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
      web: { boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' },
    }),
  },
  serviceItemImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  serviceItemBody: {
    flex: 1,
    minHeight: 90,
    justifyContent: 'space-between',
  },
  serviceItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  trendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendingBadgeText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '800',
  },
  serviceItemTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
    marginBottom: 2,
  },
  serviceItemDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 6,
  },
  serviceItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  priceContainer: {
    flexShrink: 1,
  },
  bookButton: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  trustSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    textAlign: 'center',
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  trustIcon: {
    marginBottom: 6,
  },
  trustHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  trustSub: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
});
