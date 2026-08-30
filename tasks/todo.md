## Ana Sayfa Hero Alanındaki Mavi Butonun (Culture CTA) Kaldırılması

### Yapılan Değişiklikler

1. **`src/features/routes/public/home/components/home-hero.tsx`**:
   - Vurgulu mavi "Türk Kültürünü ve Mitolojisini Keşfetmek İster Misiniz? →" butonu ve kullanılmayan `Sparkles` ikonu bileşenden kaldırıldı.
   - Giriş Yap ve Yönetici Alanı hızlı erişim butonları ortalanmış ve sadeleştirilmiş düzenle korundu.

2. **`src/features/routes/public/home/types.ts` & i18n (`tr.ts`, `en.ts`)**:
   - `PublicHomeCopy` arayüzündeki `cultureCta` alanı ve ilgili Türkçe/İngilizce çeviri anahtarları temizlendi.

### Doğrulama Sonuçları

- **TypeScript Strict Kontrolü (`npm run type-check`)**: Sıfır hata ile tamamlandı.
- **Production Build (`npm run build`)**: 19 rotanın tamamı Turbopack ile başarıyla derlendi.
