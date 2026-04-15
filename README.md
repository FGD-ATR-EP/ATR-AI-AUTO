# ATR-AI-AUTO

เว็บแอปสำหรับมอนิเตอร์ข้อมูลรถยนต์และวิเคราะห์เชิงวินิจฉัย ออกแบบให้ใช้งานได้ทั้งบนเบราว์เซอร์ (โหมดพัฒนา/จำลองข้อมูล) และบน Android ผ่าน Capacitor

## คุณสมบัติหลัก

- Dashboard หลักแบบ GunUI สำหรับสรุปสถานะเครื่องยนต์และระดับความเสี่ยง
- หน้าจอ Live Monitor สำหรับดูข้อมูลแบบเรียลไทม์
- หน้าจอ DTC Scanner สำหรับจัดการโค้ดปัญหา
- หน้า Reports สำหรับดูสรุปผลย้อนหลัง
- ระบบ Subscription สำหรับแยกสิทธิ์การใช้งาน
- รองรับหลายภาษา (EN/TH) ผ่าน utility i18n
- มี Simulation Engine สำหรับจำลองสถานะปกติและสถานะผิดปกติของระบบ

## Tech Stack

- React 19 + Vite 7
- React Router 7
- Tailwind CSS 4
- Capacitor 8 (Android)
- Recharts, Framer Motion, Lucide React

## โครงสร้างโปรเจกต์ (ย่อ)

```text
src/
├── components/   # คอมโพเนนต์ UI และเลย์เอาต์
├── context/      # User / Vehicle / OBD state
├── engine/       # แกนวิเคราะห์ + parser/analyzer
├── pages/        # Dashboard, Live, DTC, Reports, Subscription
├── services/     # Bluetooth service
├── utils/        # constants, i18n, helper functions
└── config/       # สเปคและเกณฑ์การวิเคราะห์รถ
```

## การเริ่มต้นใช้งาน

### 1) ติดตั้ง dependencies

```bash
npm install
```

### 2) รันโหมดพัฒนา

```bash
npm run dev
```

จากนั้นเปิด `http://localhost:5173`

### 3) ตรวจสอบคุณภาพโค้ดก่อนปล่อย

```bash
npm run lint
npm run build
```

## Android (Capacitor)

หลังจาก build เว็บแล้ว สามารถซิงก์โปรเจกต์ Android ได้ด้วย:

```bash
npm run build
npx cap sync android
npx cap open android
```

## คำสั่งที่ใช้บ่อย

- `npm run dev` เริ่ม development server
- `npm run lint` ตรวจมาตรฐานโค้ด
- `npm run build` สร้างไฟล์ production
- `npm run preview` พรีวิว build บนเครื่อง

## หมายเหตุ

- โฟลเดอร์ `android/` มีโปรเจกต์เนทีฟสำหรับ build แอป Android
- Bluetooth และความสามารถบางอย่างของ Capacitor ควรทดสอบบนอุปกรณ์จริงหรือ emulator ที่รองรับ
- มีการลบรายการข้อเสนอแนะที่ดำเนินการเสร็จแล้วออกจากเอกสาร เพื่อไม่ให้ปะปนกับงานที่ยังเปิดอยู่

## Notes (EN)

- This repository includes a browser simulation mode and Android packaging support through Capacitor.
- The Live Monitor page now renders a sample Recharts line graph instead of placeholder text.
- Completed suggestion items have been removed so only active work remains in the project backlog/documentation.

## DevOps Documentation

- [Enterprise CI/CD + Deployment Blueprint (DevSecOps + LLMOps)](docs/CI_CD_DEPLOYMENT_BLUEPRINT.md)
