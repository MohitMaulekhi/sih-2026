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
import { RatingStars, PriceTag, EmptyState } from '@repo/ui';
import { formatDuration } from '@repo/utils';
import { Search, X, Check, Clock, Sparkles } from 'lucide-react-native';

export default function CustomerExploreScreen() {
  const router = useRouter();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price_asc' | 'price_desc'>('popular');

  useEffect(() => {
    const load = () => {
      setCategories(dbStore.getCategories());
      setServices(
        dbStore.getServices({
          categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
          searchQuery: searchQuery.trim() || undefined,
          sortBy,
        })
      );
    };

    load();
    const unsub = dbStore.subscribe(load);
    return unsub;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Services</Text>
        <Text style={styles.headerSubtitle}>
          Compare & book top verified services
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all services & categories..."
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

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              selectedCategory === 'all' && styles.chipSelected,
            ]}
            onPress={() => setSelectedCategory('all')}>
            <Sparkles size={13} color={selectedCategory === 'all' ? '#FFFFFF' : '#EA580C'} style={{ marginRight: 4 }} />
            <Text
              style={[
                styles.chipText,
                selectedCategory === 'all' && styles.chipTextSelected,
              ]}>
              All Services
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => setSelectedCategory(cat.id)}>
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sorting Chips */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'popular' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('popular')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'popular' && styles.sortButtonTextActive,
              ]}>
              Popular
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'rating' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('rating')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'rating' && styles.sortButtonTextActive,
              ]}>
              Top Rated
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === 'price_asc' && styles.sortButtonActive,
            ]}
            onPress={() => setSortBy('price_asc')}>
            <Text
              style={[
                styles.sortButtonText,
                sortBy === 'price_asc' && styles.sortButtonTextActive,
              ]}>
              Price: Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Services List */}
      <ScrollView
        contentContainerStyle={styles.servicesScroll}
        showsVerticalScrollIndicator={false}>
        {services.length === 0 ? (
          <EmptyState
            icon="search"
            title="No Services Found"
            description="Try changing your search terms or category filter"
            actionText="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          />
        ) : (
          services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => router.push(`/service/${service.id}` as any)}>
              <Image
                source={{ uri: service.imageUrl }}
                style={styles.cardImage}
              />

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardCategory}>
                    {service.category?.name || 'Home Service'}
                  </Text>
                  <RatingStars
                    rating={service.rating}
                    reviewsCount={service.reviewsCount}
                    size="small"
                  />
                </View>

                <Text style={styles.cardTitle}>{service.title}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {service.shortDescription}
                </Text>

                {/* Key Features Bullets */}
                <View style={styles.featuresList}>
                  {service.features.slice(0, 2).map((feat, idx) => (
                    <View key={idx} style={styles.featureItemRow}>
                      <Check size={12} color="#16A34A" style={{ marginRight: 6 }} />
                      <Text style={styles.featureItem} numberOfLines={1}>
                        {feat}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <View style={styles.durationRow}>
                      <Clock size={11} color="#64748B" style={{ marginRight: 3 }} />
                      <Text style={styles.durationText}>
                        {formatDuration(service.durationMinutes)}
                      </Text>
                    </View>
                    <PriceTag
                      price={service.discountedPrice ?? service.basePrice}
                      originalPrice={service.discountedPrice ? service.basePrice : null}
                      size="medium"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    activeOpacity={0.8}
                    onPress={() => router.push(`/book/${service.id}` as any)}>
                    <Text style={styles.bookBtnText}>Book Service</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearch: {
    paddingHorizontal: 4,
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipSelected: {
    backgroundColor: '#EA580C',
    borderColor: '#EA580C',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 2,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  sortButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  sortButtonActive: {
    backgroundColor: '#FFEDD5',
  },
  sortButtonText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#EA580C',
    fontWeight: '800',
  },
  servicesScroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)' },
    }),
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  featuresList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureItem: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
  },
  bookBtn: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
