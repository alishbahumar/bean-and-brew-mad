import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutUp, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { PressableScale } from '@/components/PressableScale';
import { radius, useTheme } from '@/constants/theme';

export type DialogAction = { label: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void };
type DialogState = { title: string; message?: string; actions: DialogAction[]; icon?: IconName };
type Toast = { id: number; message: string };

type FeedbackValue = {
  /** Works on phone AND web (React Native's Alert.alert does nothing on web). */
  confirm: (title: string, message?: string, actions?: DialogAction[], icon?: IconName) => void;
  toast: (message: string) => void;
};

const FeedbackContext = createContext<FeedbackValue | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const confirm = useCallback<FeedbackValue['confirm']>((title, message, actions, icon) => {
    setDialog({ title, message, icon, actions: actions?.length ? actions : [{ label: 'OK' }] });
  }, []);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const value = useMemo(() => ({ confirm, toast: showToast }), [confirm, showToast]);

  const press = (a: DialogAction) => {
    setDialog(null);
    a.onPress?.();
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}

      {toast && (
        <Animated.View
          key={toast.id}
          entering={FadeInUp.springify().damping(14)}
          exiting={FadeOutUp.duration(200)}
          pointerEvents="none"
          style={[styles.toastWrap, { top: insets.top + 10 }]}>
          <View style={[styles.toast, { backgroundColor: t.card, borderColor: t.primary }]}>
            <View style={[styles.toastDot, { backgroundColor: t.primary }]}>
              <Icon name="check" color={t.onPrimary} size={14} />
            </View>
            <Text style={[styles.toastText, { color: t.text }]} numberOfLines={2}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}

      <Modal visible={!!dialog} transparent animationType="none" onRequestClose={() => setDialog(null)}>
        {dialog && (
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(150)} style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setDialog(null)} accessibilityLabel="Close dialog" />
            <Animated.View
              entering={ZoomIn.springify().damping(15)}
              style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}>
              {dialog.icon ? (
                <View style={[styles.iconBadge, { backgroundColor: t.tile }]}>
                  <Icon name={dialog.icon} color={t.primary} size={30} />
                </View>
              ) : null}
              <Text style={[styles.title, { color: t.text }]}>{dialog.title}</Text>
              {dialog.message ? <Text style={[styles.message, { color: t.muted }]}>{dialog.message}</Text> : null}
              <View style={styles.actions}>
                {dialog.actions.map((a) => {
                  const primary = a.style !== 'cancel';
                  const danger = a.style === 'destructive';
                  return (
                    <PressableScale
                      key={a.label}
                      accessibilityRole="button"
                      onPress={() => press(a)}
                      scaleTo={0.95}
                      style={[
                        styles.action,
                        primary
                          ? { backgroundColor: danger ? t.danger : t.primary }
                          : { borderWidth: 1, borderColor: t.border },
                      ]}>
                      <Text style={{ color: primary ? t.onPrimary : t.text, fontWeight: '700', fontSize: 15 }}>
                        {a.label}
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </Modal>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error('useFeedback must be used inside <FeedbackProvider>');
  return ctx;
}

const styles = StyleSheet.create({
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    maxWidth: 420,
  },
  toastDot: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  toastText: { fontSize: 14, fontWeight: '700', flexShrink: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { width: '100%', maxWidth: 360, borderRadius: radius.lg, borderWidth: 1, padding: 22, gap: 8, alignItems: 'center' },
  iconBadge: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 19, fontWeight: '800', textAlign: 'center' },
  message: { fontSize: 14, lineHeight: 21, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14, alignSelf: 'stretch' },
  action: { flex: 1, minHeight: 46, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
});
