# Enterprise CI/CD + Deployment Blueprint

เอกสารนี้เป็นพิมพ์เขียวระดับ Enterprise สำหรับโปรเจกต์ **Next.js + AI Multi-Agent** โดยออกแบบให้ครอบคลุมทั้ง **DevSecOps** และ **LLMOps** ตั้งแต่การพัฒนา, ตรวจคุณภาพ, ประเมินโมเดล, จัดการโครงสร้างพื้นฐาน, deploy แบบปลอดภัย, monitor และ rollback ได้จริงในองค์กรขนาดใหญ่

---

## 1) เป้าหมายเชิงสถาปัตยกรรม

- ลดความเสี่ยงจากการเปลี่ยนแปลงทั้งระดับ code, model/prompt และ infrastructure
- สร้าง pipeline ที่ตรวจสอบได้ (traceable), ทำซ้ำได้ (reproducible), และ audit ได้ (auditable)
- รองรับการปล่อยแบบ progressive delivery (canary/blue-green) โดยไม่หยุดระบบ
- ควบคุมความปลอดภัยข้อมูลส่วนบุคคล (PDPA/GDPR) และต้นทุน cloud/LLM ไปพร้อมกัน

---

## 2) โครงสร้าง Repository และ Branching Strategy

### Repository Strategy

แนะนำโครงสร้างแบบแยก concern ชัดเจน:

- `app/` — Next.js application (frontend + API routes)
- `agents/` — multi-agent orchestration, tools, prompt templates
- `infra/` — Terraform/OpenTofu modules + environment overlays
- `ops/` — Kubernetes manifests/Helm, policy, runbooks
- `docs/` — architecture records, compliance checklist, postmortem

### Branch Model

- `main` = production-ready (protected branch)
- `develop` = staging integration branch
- `feature/*` = development branch
- `hotfix/*` = emergency fix
- `release/*` = optional pre-production stabilization

### Merge Policy

- ต้องผ่าน Pull Request + reviewer อย่างน้อย 2 คนสำหรับระบบ critical
- Required checks: security scan, tests, build, LLM eval gates, IaC scan
- บังคับ signed commits / DCO ตาม policy องค์กร

---

## 3) Environment Topology

- **Dev**: รัน feature branch + ephemeral env (preview URL)
- **Staging**: integration tests, load tests, agent eval ชุดใหญ่
- **Prod**: progressive rollout + strict approvals
- **DR**: warm standby หรือ pilot-light ตาม RTO/RPO ขององค์กร

### Secret & Config Management

- ใช้ Vault / Cloud Secret Manager / SSM Parameter Store
- ห้ามเก็บ key, token, keystore ใน repo
- แยก key ตาม environment และกำหนด rotation schedule

---

## 4) CI/CD Pipeline Stages (DevSecOps + LLMOps)

## Stage A: Source & Policy Validation

1. Checkout + provenance verification
2. Secret scanning (เช่น Gitleaks)
3. SAST (CodeQL/Semgrep)
4. Dependency + License scan (SCA)
5. IaC scan (Checkov/tfsec)
6. Policy-as-Code checks (OPA/Conftest)

**Gate:** ถ้า fail ขั้นใดขั้นหนึ่งให้หยุด pipeline ทันที

## Stage B: Build + Unit/Integration Tests

1. Setup runtime (Node + pnpm/npm cache)
2. Install dependencies (`npm ci`)
3. Run lint/test/build
4. Build Docker image with SBOM + image signing (Sigstore/Cosign)
5. Upload artifact + attestation

## Stage C: LLMOps Evaluation Pipeline (ก่อน Deploy)

> สำหรับ AI Multi-Agent ต้องมี gate เฉพาะ model/prompt behavior

1. **Prompt Versioning**
   - แยก version ของ prompt จาก source code
   - แนะนำใช้ LangSmith หรือ Weights & Biases เพื่อ trace prompt + output

2. **Automated Evaluations**
   - ใช้ RAGAS / G-Eval / custom eval suite
   - วัด metrics สำคัญ:
     - Hallucination Rate
     - Faithfulness
     - Relevancy
     - Tool-use correctness (สำหรับ agent ที่เรียก external tools)

3. **Safety & Compliance Evals**
   - red-team prompts, jailbreak resistance, toxicity checks
   - policy checks สำหรับข้อมูลสำคัญ/คำตอบต้องห้าม

4. **Cost Guardrail Step**
   - ประเมิน token usage ต่อ test suite
   - คำนวณต้นทุนคาดการณ์ก่อน promote
   - fail pipeline หากเกิน budget threshold ของ environment

**Gate:** ผ่านเฉพาะเมื่อ quality, safety และ cost อยู่ในเกณฑ์

## Stage D: Package + Release Candidate

- สร้าง immutable artifact (container/tag) พร้อม metadata
- Publish to private registry
- Generate changelog/release notes อัตโนมัติ

## Stage E: Deployment (Staging -> Production)

1. Deploy to Staging ด้วย Helm/Kustomize
2. Smoke + synthetic + integration tests
3. Manual approval (4-eyes principle) สำหรับ production
4. Production rollout แบบ Canary/Blue-Green
5. Auto rollback เมื่อ error budget breach

---

## 5) Infrastructure as Code (IaC) และ GitOps

### IaC Baseline

- ใช้ **Terraform หรือ OpenTofu** จัดการ:
  - Kubernetes cluster (EKS/GKE/AKS)
  - VPC/Subnet/NAT/WAF/LB
  - Managed DB + backup policy
  - IAM roles และ key management

### GitOps for Infra

- เก็บ IaC ใน repo เดียวกัน (mono-repo) หรือแยก repo (infra-repo)
- ทุก infra change ต้องผ่าน Pull Request + plan review
- บังคับ `terraform plan` ใน CI และ apply ผ่าน protected workflow

### Disaster Recovery Readiness

- เตรียม DR runbook + tested restore process
- ทำ snapshot/backup แบบ schedule และทดสอบกู้คืนรายไตรมาส

---

## 6) Kubernetes + Service Mesh สำหรับ Enterprise

แนะนำใช้ **Istio หรือ Linkerd** เพื่อเพิ่มความสามารถระดับเครือข่าย:

- **mTLS by default** ระหว่าง service ภายใน cluster
- **Advanced traffic splitting** รองรับ canary/blue-green ระดับ L7
- **Fine-grained policy** เช่น authorization ต่อ workload
- **Observability map** เห็น service-to-service dependency ชัดเจน

### Runtime Security เพิ่มเติม

- Pod Security Standards / Admission Controller
- Image allowlist + signed image verification
- NetworkPolicy จำกัด east-west traffic

---

## 7) Data Protection, PDPA/GDPR และ AI Privacy Controls

### PII Redaction Layer

- เพิ่ม middleware ใน backend/agent gateway เพื่อทำ detection + masking
- บังคับ redaction ก่อน:
  - ส่งข้อมูลเข้า LLM
  - เขียน logs/traces
  - เก็บ conversation history

### Data Residency

- กำหนด region ของ Vector DB/Primary DB ให้สอดคล้องข้อกำหนดประเทศ
- แยก storage ตาม jurisdiction หากต้องรองรับหลายประเทศ

### Compliance Controls

- Data retention policy + right-to-erasure workflow
- Audit log ที่ immutable สำหรับกิจกรรมเข้าถึงข้อมูล
- DPA/consent flow และ legal basis tracking

---

## 8) FinOps และ Cost Governance

ระบบ AI Multi-Agent มีโอกาสใช้ทรัพยากรสูง ต้องมี guardrail:

- กำหนด Kubernetes **Resource Quotas** ต่อ namespace (dev/staging/prod)
- ตั้ง HPA/VPA ด้วย minimum-maximum bounds
- ใช้ **Kubecost** แสดงต้นทุนราย service/agent/team
- ตั้ง budget alert (daily/weekly/monthly) แยก compute, storage, token usage
- ทำ cost anomaly detection เพื่อหยุดงาน batch ที่ผิดปกติ

---

## 9) Database Migration Strategy (Zero-Downtime)

ใช้แนวทาง **Expand/Contract Pattern**:

1. **Expand**: เพิ่ม schema ใหม่แบบ backward compatible
2. deploy app ที่เขียนได้ทั้ง schema เก่า/ใหม่
3. migrate data แบบ incremental/background
4. switch read path ไป schema ใหม่
5. **Contract**: ลบ schema เก่าเมื่อแน่ใจว่าไม่มี dependency

### Deployment Safety for DB

- ทุก migration ต้องมี rollback plan
- แยก migration job ออกจาก app startup
- lock timeout/retry strategy สำหรับตารางใหญ่

---

## 10) Enterprise Reference Workflow (GitHub Actions Blueprint)

```yaml
name: enterprise-cicd

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]
    tags: ['v*']

jobs:
  validate-security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - run: npm run security:scan
      - run: npm run iac:scan

  llm-evaluation:
    needs: validate-security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run prompts:version-check
      - run: npm run eval:ragas
      - run: npm run eval:safety
      - run: npm run eval:cost-guardrail

  package:
    needs: llm-evaluation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ghcr.io/org/app:${{ github.sha }} .
      - run: npm run sbom:generate
      - run: npm run image:sign

  deploy-staging:
    needs: package
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - run: ./ops/deploy.sh staging

  deploy-production:
    needs: package
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: ./ops/deploy.sh production --strategy=canary
```

---

## 11) Observability, SLO และ Incident Response

- Centralized logs + distributed tracing + metrics
- AI telemetry แยกจาก app telemetry (latency/token/tool errors)
- กำหนด SLO เช่น:
  - p95 latency
  - error rate
  - hallucination threshold ใน production sampling
- Alert routing ไป on-call channel พร้อม playbook
- ทำ incident review/postmortem ภายใน SLA ที่กำหนด

---

## 12) Enterprise Rollback Playbook

1. freeze rollout และปิด traffic เพิ่มเติม
2. rollback ไป revision ก่อนหน้าด้วย GitOps
3. revert prompt/model version (ถ้าเป็น LLM regression)
4. เปิด feature flag fallback path
5. สื่อสาร incident status กับ stakeholder
6. เก็บ evidence สำหรับ postmortem และ compliance

---

## 13) 30/60/90 Day Adoption Plan

- **30 วันแรก**: ตั้ง baseline CI security + test + build + prompt registry
- **60 วัน**: เพิ่ม LLM eval automation, IaC GitOps, service mesh pilot
- **90 วัน**: เปิด production canary automation, FinOps dashboard, DR drill และ compliance audit

---

## 14) Checklist ก่อน Go-Live

- [ ] Security scans ผ่านครบทุก stage
- [ ] LLM eval metrics ผ่านเกณฑ์องค์กร
- [ ] PII redaction tested end-to-end
- [ ] Data residency verified
- [ ] DB migration runbook + rollback tested
- [ ] SLO dashboards + alerts พร้อมใช้งาน
- [ ] Cost guardrails + budget alerts เปิดใช้งาน
- [ ] DR restore test ผ่านล่าสุด

