# Pay-Trace Sidebar, Core ve Form Bileşenlerinin Vantor'a Entegrasyonu

## İnceleme ve Sonuç Özeti

### Yapılan Değişiklikler

1. **Temel Bağımlılıklar ve Yapılandırma**:
   - `@radix-ui/react-compose-refs` paketi [package.json](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/package.json) dosyasına eklendi.
   - [tailwind.config.mjs](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/tailwind.config.mjs) güncellendi (`minWidth.table = '760px'`, `fontSize.micro`, `fontSize.compact`, `fontSize.caption`, `maxHeight.dialog`).
   - [src/i18n/routing.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/i18n/routing.ts) içine `BCP47_LOCALES` ve `toBCP47Locale` eklendi.
   - [src/lib/utils/number-format.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/lib/utils/number-format.ts) içine `formatAmountInput` ve `parseAmountInput` eklendi; [src/lib/utils.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/lib/utils.ts) üzerinden dışa aktarıldı.
   - [src/hooks/use-i18n.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/hooks/use-i18n.ts) kancası (locale-aware para birimi, yüzde, süre ve tarih formatlama yardımcıları) oluşturuldu.

2. **Core Bileşenleri (`src/components/core`)**:
   - [delete-confirmation-dialog.module.css](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/delete-confirmation-dialog.module.css) ve [delete-confirmation-dialog.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/delete-confirmation-dialog.tsx): Crumple-and-toss animasyonlu, domain-bağımsız silme onay diyaloğu.
   - [density-toggle.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/density-toggle.tsx): Kompakt/detaylı mod geçişi.
   - [dialog.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/dialog.tsx): Radix Select/Popover içi tıklamalarda kapanmayı önleyen ve compose refs kullanan güncellenmiş dialog.
   - [select.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/select.tsx): `NativeSelect`, `SelectItem` end adornment ve odak geri yükleme desteği.
   - [link.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/link.tsx): Koşullu buton stili uygulama düzeltmesi.
   - [form-error.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/form-error.tsx): Kısaltma ve başlık özniteliği desteği.
   - [modern-date-picker.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/modern-date-picker.tsx): Tam i18n, hızlı tarih seçim çubuğu, erişilebilirlik ve vantor-blue renk uyumu.
   - [stepper.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/stepper.tsx) ve [progress.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/core/progress.tsx): Semantik liste, a11y etiketleri ve brutalist stillerle senkronize edildi.

3. **Form Bileşenleri (`src/components/forms`)**:
   - [amount-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/amount-field.tsx): Formatlı tutar girişi.
   - [choice-card-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/choice-card-field.tsx): Seçilebilir kart radyo grubu (kompakt ve normal görünüm, önizleme desteği).
   - [file-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/file-field.tsx): Erişilebilir buton tetikleyicili dosya yükleme alanı.
   - [text-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/text-field.tsx), [textarea-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/textarea-field.tsx), [checkbox-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/checkbox-field.tsx), [radio-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/radio-field.tsx), [select-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/select-field.tsx), [switch-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/switch-field.tsx), [date-field.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/date-field.tsx), [submit-button.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/submit-button.tsx), [form.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/form.tsx): Noktalı iç içe hata çözümlemesi, dinamik özellikler ve tip güvenliği ile güncellendi.
   - [index.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/forms/index.tsx): Tüm form bileşenleri dışa aktarıldı.

4. **Sidebar ve Layout Sistemi (`src/components/layout` ve `_shared/layouts`)**:
   - [application-shell.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/layout/application-shell.tsx): Masaüstünde daraltılabilir (`w-72` / `w-20`), tooltip destekli, mobilde drawer açılır menülü, dinamik başlık ve altlık alanlarına sahip kurumsal kabuk.
   - [AdminAppShellLayout.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/layout/AdminAppShellLayout.tsx) ve [AppShellLayout.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/components/layout/AppShellLayout.tsx): Admin ve Auth alanları için ApplicationShell sarmalayıcıları.
   - [app-shell.tsx](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/features/routes/_shared/layouts/app-shell.tsx): `AdminShell` ve `AuthShell` yeni layout'lara bağlandı; `PublicShell` temiz public menüsüyle korundu.
   - [types.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/features/routes/_shared/layouts/types.ts), [i18n/en.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/features/routes/_shared/layouts/i18n/en.ts), [i18n/tr.ts](file:///Users/zafergok/Documents/github/ZAFER/TEMPLATE/vantor/src/features/routes/_shared/layouts/i18n/tr.ts): Başlık, alt başlık, özet ve tercih metinleriyle zenginleştirildi.

### Doğrulama Sonuçları

- `npm run type-check`: 0 hata ile başarıyla tamamlandı.
- `npm run build`: Turbopack ile tüm 18 rota statik/dinamik olarak başarıyla derlendi.
- Açık kalan hata veya uyarı bulunmamaktadır.
