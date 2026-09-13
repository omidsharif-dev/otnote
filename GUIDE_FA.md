# راهنمای کامل پروژه **ot note**

## 📁 ساختار پروژه

```
otnote/
├── android/                    # تنظیمات بیلد اندروید (APK)
│   ├── app/
│   │   ├── build.gradle        # کانفیگ بیلد اپلیکیشن
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # مجوزها و اکتیویتی‌ها
│   │   │   ├── java/com/otnote/     # کدهای جاوا (MainActivity, MainApplication)
│   │   │   └── res/                 # ریسورس‌ها (استایل، رشته‌ها)
│   ├── build.gradle            # کانفیگ بیلد ریشه
│   ├── settings.gradle         # تنظیمات ماژول‌ها
│   └── gradle/wrapper/         # Gradle Wrapper
│
├── src/                        # کد اصلی اپلیکیشن (TypeScript)
│   ├── components/             # کامپوننت‌های قابل استفاده مجدد
│   │   ├── NoteCard.tsx        # کارت نمایش یادداشت در لیست
│   │   ├── NoteEditor.tsx      # ویرایشگر یادداشت (ایجاد/ویرایش)
│   │   └── EmptyState.tsx      # حالت خالی (هیچ یادداشتی نیست)
│   │
│   ├── screens/                # صفحات اصلی
│   │   └── NoteListScreen.tsx  # صفحه لیست یادداشت‌ها
│   │
│   ├── store/                  # مدیریت Zustand
│   │   └── notesStore.ts       # استیت یادداشت‌ها + اکشن‌ها
│   │
│   ├── storage/                # لایه ذخیره‌سازی
│   │   └── notesStorage.ts     # Wrapper برای AsyncStorage
│   │
│   ├── types/                  # تعریف تایپ‌های TypeScript
│   │   └── note.ts             # اینترفیس Note
│   │
│   ├── constants/              # ثابت‌های طراحی
│   │   └── theme.ts            # رنگ‌ها، فاصله‌ها، تایپوگرافی
│   │
│   └── navigation/             # ناوبری React Navigation
│       └── AppNavigator.tsx    # استک ناوبری
│
├── App.tsx                     # نقطه ورود اپلیکیشن
├── index.js                    # ثبت کامپوننت React Native
├── package.json                # وابستگی‌ها و اسکریپت‌ها
├── tsconfig.json               # تنظیمات TypeScript
├── babel.config.js             # تنظیمات Babel
├── metro.config.js             # تنظیمات Metro Bundler
└── README.md                   # مستندات
```

---

## 🎯 ویژگی‌های پیاده‌سازی شده

| ویژگی | توضیح |
|----------|-------|
| **ایجاد یادداشت** | عنوان + محتوای متنی |
| **ویرایش یادداشت** | با Tap روی کارت |
| **حذف یادداشت** | با Long Press + تایید |
| **ذخیره محلی** | AsyncStorage (بدون سرور) |
| **رابط کاربری مینیمال** | خاکستری‌های خنثی + آکسیو آبی |
| **تایپ سکریپت کامل** | بدون `any` غیرضروری |

---

## 🛠 پیش‌نیازها

- **Node.js** ≥ 18
- **JDK** 17 یا 21
- **Android Studio** + SDK (API 34)
- **Gradle** 8.5+ (از wrapper استفاده می‌شود)

---

## 🚀 دستورات اجرا

```bash
# 1. ورود به پوشه پروژه
cd otnote

# 2. نصب وابستگی‌ها
npm install

# 3. اجرای Metro Bundler (در ترمینال جداگانه)
npm start

# 4. اجرا روی اندروید (دستگاه/امولاتور)
npm run android
```

---

## 📦 بیلد APK انتشار

```bash
cd otnote/android

# بیلد Release APK
./gradlew assembleRelease
```

**خروجی:** `android/app/build/outputs/apk/release/app-release.apk`

> نکته: برای امضای رسمی، در `android/app/build.gradle` بخش `signingConfigs.release` را با Keystore خود تنظیم کنید.

---

## 🎨 طراحی (Theme)

**فایل:** `src/constants/theme.ts`

| دسته | مقادیر |
|------|--------|
| **رنگ‌ها** | `background: #FAFAFA`, `surface: #FFFFFF`, `accent: #2563EB` |
| **فاصله‌ها** | واحد پایه 8px (xs=4, sm=8, md=16, lg=24, xl=32) |
| **شعاع‌ها** | sm=8, md=12, lg=16 |
| **تایپوگرافی** | System Font، ۵ وزن (heading, title, body, bodySmall, caption) |
| **سایه** | Elevation 1، بلور 2px |

---

## 💾 مدل داده

```typescript
// src/types/note.ts
interface Note {
  id: string;           // UUID
  title: string;        // عنوان
  content: string;      // متن
  createdAt: number;    // Timestamp
  updatedAt: number;    // Timestamp
}
```

---

## 🔄 جریان داده

```
User Action
     │
     ▼
NoteListScreen (UI)
     │
     ├─► useNotesStore (Zustand)
     │       │
     │       ├─► addNote() ──────► notesStorage.add() ──► AsyncStorage
     │       ├─► updateNote() ──► notesStorage.update() ─► AsyncStorage
     │       └─► deleteNote() ──► notesStorage.remove() ─► AsyncStorage
     │
     ▼
Re-render با state جدید
```

---

## 🧩 کامپوننت‌های کلیدی

### NoteCard
- نمایش عنوان، پیش‌نمای محتوا (۸۰ کاراکتر)، تاریخ نسبی
- `onPress` → ویرایش، `onLongPress` → حذف

### NoteEditor
- دو TextInput: عنوان (تک خطی) + محتوا (چند خطی)
- دکمه‌های Cancel / Save
- `autoFocus` روی عنوان در حالت ایجاد

### EmptyState
- آیکون، متن راهنما، دکمه «+ New Note»

---

## 📱 ناوبری

- **Stack Navigator** (بدون هدر)
- یک Screen: `Notes` → `NoteListScreen`
- ویرایشگر به صورت Modal در همون Screen رندر می‌شود

---

## ⚙️ تنظیمات مهم اندروید

| فایل | هدف |
|------|-----|
| `AndroidManifest.xml` | مجوز INTERNET، MainActivity، تم |
| `build.gradle (app)` | `minSdk 24`, `targetSdk 34`, Hermes فعال |
| `proguard-rules.pro` | قانون‌های ProGuard برای Release |
| `network_security_config.xml` | Cleartext برای لوکال‌هاست (دیباگ) |

---

## 🐛 عیب‌یابی رایج

| مشکل | راه‌حل |
|-------|--------|
| `npm start` کار نکرد | `npx react-native start --reset-cache` |
| APK نصب نشد | `adb uninstall com.otnote` بعد نصب مجدد |
| تغییرات UI دیده نشد | `npm start -- --reset-cache` یا Restart Metro |
| TypeScript Error | `npx tsc --noEmit` برای چک کامل |

---

## 📄 لایسنس

MIT — آزاد برای استفاده شخصی و تجاری.