import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
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

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load and subscribe to store changes
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
            <Text style={styles.locationLabel}>DELIVERING TO</Text>
            <TouchableOpacity
              style={styles.locationRow}
              activeOpacity={0.7}
              onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.locationPin}>📍</Text>
              <Text style={styles.locationCity}>
                {user?.city || 'Bengaluru'}
              </Text>
              <Text style={styles.locationAddress} numberOfLines={1}>
                • {user?.address ? 'Home' : 'Indiranagar 100ft Rd'}
              </Text>
              <Text style={styles.dropdownIcon}>▾</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => router.push('/(tabs)/profile')}
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
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search 'AC service', 'cleaning', 'plumber'..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Promotional Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>⚡ MONSOON SPECIALS</Text>
            </View>
            <Text style={styles.heroHeading}>AC & Home Deep Cleaning</Text>
            <Text style={styles.heroSubtitle}>
              Up to 30% OFF • 100% Certified Technicians
            </Text>
            <TouchableOpacity
              style={styles.heroCta}
              activeOpacity={0.8}
              onPress={() => setSelectedCategory('cat-ac-repair')}>
              <Text style={styles.heroCtaText}>Explore Offers ➔</Text>
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
          emoji="✨"
          title="Categories"
          subtitle="Explore all verified home services"
          actionText={selectedCategory ? 'Clear Filter' : undefined}
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
                  <IconHelper name={cat.icon} size={24} />
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
              emoji="🔥"
              title="Most Booked Services"
              subtitle="Trusted by 50,000+ households"
              actionText="View All"
              onActionPress={() => router.push('/(tabs)/explore')}
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
                  onPress={() => router.push(`/service/${service.id}`)}>
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
                      <Text style={styles.durationBadge}>
                        ⏱️ {formatDuration(service.durationMinutes)}
                      </Text>
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
                        onPress={() => router.push(`/book/${service.id}`)}>
                        <Text style={styles.bookMiniBtnText}>Book</Text>
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
          emoji="🛠️"
          title={
            selectedCategory
              ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Filtered'} Services`
              : searchQuery
                ? `Results for "${searchQuery}"`
                : 'All Doorstep Services'
          }
          subtitle="Top rated professionals ready to serve"
        />

        <View style={styles.servicesList}>
          {searchFiltered.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItemCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/service/${service.id}`)}>
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
                      <Text style={styles.trendingBadgeText}>Bestseller</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.serviceItemTitle}>{service.title}</Text>
                <Text style={styles.serviceItemDesc} numberOfLines={2}>
                  {service.shortDescription}
                </Text>

                <View style={styles.serviceItemBottom}>
                  <PriceTag
                    price={service.discountedPrice ?? service.basePrice}
                    originalPrice={service.discountedPrice ? service.basePrice : null}
                    size="medium"
                  />
                  <TouchableOpacity
                    style={styles.bookButton}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/book/${service.id}`)}>
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust Badges Section */}
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>The Urban Company Promise</Text>
          <View style={styles.trustGrid}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🛡️</Text>
              <Text style={styles.trustHeading}>Verified Pros</Text>
              <Text style={styles.trustSub}>Background checked & trained</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>⏱️</Text>
              <Text style={styles.trustHeading}>On-Time Arrival</Text>
              <Text style={styles.trustSub}>Strict adherence to time slots</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>💯</Text>
              <Text style={styles.trustHeading}>30-Day Cover</Text>
              <Text style={styles.trustSub}>Free rework if not satisfied</Text>
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
  locationPin: {
    fontSize: 14,
    marginRight: 4,
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
  dropdownIcon: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  avatarButton: {
    marginLeft: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  avatarFallback: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#7C3AED',
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
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearch: {
    color: '#94A3B8',
    fontSize: 16,
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
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
  },
  heroBadgeText: {
    color: '#C4B5FD',
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
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    gap: 10,
    marginBottom: 16,
  },
  categoryCard: {
    width: '22.5%',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryCardSelected: {
    backgroundColor: '#EDE9FE',
    borderColor: '#7C3AED',
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
    backgroundColor: '#7C3AED',
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  categoryNameSelected: {
    color: '#7C3AED',
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
    backgroundColor: '#7C3AED',
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
    width: 95,
    height: 95,
    borderRadius: 12,
  },
  serviceItemBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  serviceItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  serviceItemDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 8,
  },
  serviceItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 24,
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
