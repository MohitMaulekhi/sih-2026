import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@repo/auth';
import { dbStore } from '@repo/db';
import { Service, ServiceCategory, ProfessionalService } from '@repo/types';
import { formatCurrency, formatDuration } from '@repo/utils';
import { useTranslation } from '@repo/i18n';
import { Zap, Clock, Wrench } from 'lucide-react-native';

export default function ProfessionalServicesScreen() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [offeredServices, setOfferedServices] = useState<ProfessionalService[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const load = () => {
      setCategories(dbStore.getCategories());
      setAllServices(dbStore.getServices());
      if (user?.id) {
        setOfferedServices(dbStore.getProfessionalServices(user.id));
      }
    };

    load();
    const unsub = dbStore.subscribe(load);
    return unsub;
  }, [user]);

  const isServiceOffered = (serviceId: string): boolean => {
    const match = offeredServices.find(
      (ps) => ps.serviceId === serviceId && ps.isAvailable
    );
    return !!match;
  };

  const handleToggleOffering = (service: Service, value: boolean) => {
    if (!user?.id) return;
    try {
      dbStore.toggleServiceOffering(user.id, {
        serviceId: service.id,
        isAvailable: value,
        customPrice: service.discountedPrice ?? service.basePrice,
      });
      Alert.alert(
        value ? 'Service Activated!' : 'Service Paused',
        value
          ? `You will now receive customer bookings for ${service.title}.`
          : `You have temporarily paused bookings for ${service.title}.`
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update service');
    }
  };

  const filteredServices =
    selectedCategory === 'all'
      ? allServices
      : allServices.filter(
          (s) =>
            s.categoryId === selectedCategory ||
            s.category?.slug === selectedCategory
        );

  const activeCount = offeredServices.filter((ps) => ps.isAvailable).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('professional.services.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('professional.services.subtitle')}
        </Text>

        {/* Stats banner */}
        <View style={styles.activeBanner}>
          <View style={styles.activeBadge}>
            <Zap size={12} color="#34D399" style={{ marginRight: 4 }} />
            <Text style={styles.activeBadgeText}>
              {activeCount} {t('professional.services.servicesActive')}
            </Text>
          </View>
          <Text style={styles.activeSub}>
            {t('professional.services.activeSub')}
          </Text>
        </View>

        {/* Category chips */}
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
            <Text
              style={[
                styles.chipText,
                selectedCategory === 'all' && styles.chipTextSelected,
              ]}>
              {t('professional.services.allCategories')}
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
      </View>

      <ScrollView
        contentContainerStyle={styles.servicesScroll}
        showsVerticalScrollIndicator={false}>
        {filteredServices.map((service) => {
          const active = isServiceOffered(service.id);
          const price = service.discountedPrice ?? service.basePrice;

          return (
            <View
              key={service.id}
              style={[styles.serviceCard, active && styles.serviceCardActive]}>
              <Image
                source={{ uri: service.imageUrl }}
                style={styles.serviceImage}
              />

              <View style={styles.serviceBody}>
                <View style={styles.serviceHeaderRow}>
                  <View style={styles.titleColumn}>
                    <Text style={styles.categoryLabel}>
                      {service.category?.name || 'Category'}
                    </Text>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                  </View>

                  <Switch
                    value={active}
                    onValueChange={(val) =>
                      handleToggleOffering(service, val)
                    }
                    trackColor={{ false: '#334155', true: '#059669' }}
                    thumbColor={active ? '#34D399' : '#94A3B8'}
                  />
                </View>

                <Text style={styles.serviceDesc} numberOfLines={2}>
                  {service.shortDescription}
                </Text>

                <View style={styles.serviceFooter}>
                  <View>
                    <View style={styles.durationRow}>
                      <Clock size={11} color="#64748B" style={{ marginRight: 3 }} />
                      <Text style={styles.durationText}>
                        {formatDuration(service.durationMinutes)}
                      </Text>
                    </View>
                    <Text style={styles.priceText}>
                      {t('professional.services.payout')}: {formatCurrency(price)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      active
                        ? styles.statusPillActive
                        : styles.statusPillInactive,
                    ]}>
                    <Text
                      style={[
                        styles.statusPillText,
                        active
                          ? styles.statusPillTextActive
                          : styles.statusPillTextInactive,
                      ]}>
                      {active ? t('professional.services.offering') : t('professional.services.notOffering')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 10,
  },
  activeBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  activeBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '800',
  },
  activeSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 6,
  },
  chip: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipSelected: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  servicesScroll: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  serviceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    gap: 12,
  },
  serviceCardActive: {
    borderColor: '#059669',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  serviceBody: {
    flex: 1,
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
    textTransform: 'uppercase',
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  serviceDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    fontSize: 11,
    color: '#64748B',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPillInactive: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statusPillTextActive: {
    color: '#34D399',
  },
  statusPillTextInactive: {
    color: '#64748B',
  },
});
