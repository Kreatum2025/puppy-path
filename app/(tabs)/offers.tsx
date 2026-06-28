import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppHeader, AppText, ScreenContainer } from '@/components';
import { NativeOfferCard } from '@/features/offers/NativeOfferCard';
import { getOffers } from '@/services/offerService';
import type { NativeOffer } from '@/types';
import { colors, spacing } from '@/theme';

export default function OffersScreen() {
  const [offers, setOffers] = useState<NativeOffer[]>([]);

  useEffect(() => {
    getOffers().then(setOffers);
  }, []);

  return (
    <ScreenContainer contentContainerStyle={{ gap: spacing.lg }}>
      <AppHeader
        overline="Hjälp i rätt tid"
        title="Erbjudanden"
        subtitle="Lugna, relevanta tips baserade på var i resan ni är. Inga högljudda annonser."
      />

      <AppCard variant="secondary" padding="md">
        <AppText variant="caption" color={colors.textMuted}>
          Det här är exempel på framtida partnerplatser. Inga länkar är aktiva ännu.
        </AppText>
      </AppCard>

      <View style={styles.list}>
        {offers.map((o) => (
          <NativeOfferCard key={o.id} offer={o} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
});
