# hand-in-sap-s4hop

> **Languages / 语言 / 言語 / 언어**: [한국어](README.ko.md) | [English](README.en.md) | [日本語](README.ja.md) | [简体中文](README.md)

SAP S/4HANA (ABAP ADT) 프로젝트 로컬 MCP(Model Context Protocol) 연동 환경입니다. 표준화된 MCP 프로토콜을 통해 AI 코딩 어시스턴트(Codex, Claude 등)를 SAP 코어 시스템과 원활하게 연결하여, 기존 SAP GUI(SE38/SE80) 및 Eclipse ADT의 번거로운 수작업과 컨텍스트 단절을 해소합니다.

본 프로젝트는 **“바이브 코딩(Vibe Coding / 몰입형 코딩)”**을 핵심 경험으로 삼고, **SAP Best Practice** 및 **Clean Core 현대화 아키텍처 원칙**을 깊이 있게 통합했습니다. 표준 MCP 프로토콜을 통한 SAP ADT 직접 연결로 **“의도 파악 ➔ 자동 테이블/코드 조회 ➔ 동적 생성 ➔ 원격 컴파일러 실시간 진단 ➔ 제어된 배포 및 검증”**의 초고속 피드백 루프를 구현합니다.

엔터프라이즈급 SAP 개발의 엄격한 규정 준수, 높은 응집도 및 무중단 업그레이드 요구사항을 충족하기 위해, 본 프로젝트는 **3대 SAP Clean Core 선언형 전문 서브 에이전트(설계, 개발, 테스트)**를 네이티브로 내장했습니다. 업계 최신 패턴인 **“선언형 설정 + 지침 문서 + 보조 스크립트”** 구조로 구축되어 아키텍처 설계부터 클라우드 대응 코딩, 품질 검토에 이르는 엔드투엔드 협업 파이프라인을 제공합니다:
- 🏛️ **설계 에이전트 (Design Agent)**: 읽기 전용 시스템 메타데이터 탐색을 기반으로 Clean Core 확장 계층(Tier 1 ABAP Cloud / Tier 2 어댑터 격리 계층 / Tier 3 SAP BTP 병렬 처리)을 철저히 준수합니다. CDS View Entity 가상 데이터 모델(VDM) 및 서비스 인터페이스 계약을 수립하여 코어 침투적 수정을 원천 차단합니다. 쓰기 권한은 `docs/design/**` 경로로 엄격히 제한됩니다.
- 💻 **개발 에이전트 (Dev Agent)**: 모던 객체지향 ABAP 및 CDS 엔티티 모델링을 적용하고 구식 절차적 문법을 배제합니다. MCP 도구를 통해 실시간 커널 구문 진단(`sap.source.diagnose`) 및 즉각적인 오류 수정을 수행하며, 3회 재시도 제한 및 서킷 브레이커를 적용하여 안정적인 고품질 코드를 생성합니다. 쓰기 권한은 `src/**` 경로로 엄격히 제한됩니다.
- 🧪 **테스트 에이전트 (Test Agent)**: 전사 Where-Used 영향 범위 분석 및 Clean Core API 릴리스 규정 준수를 검토하고, Test Double 격리를 적용한 최신 ABAP Unit 단위 테스트 클래스를 자동 구축하여 무결점 및 원활한 업그레이드를 보장합니다. 쓰기 권한은 `tests/**` 및 `docs/qa/**` 경로로 엄격히 제한됩니다.

> **🔒 견고한 엔지니어링 보호막**: 세 서브 에이전트 모두 완전한 `config.json`, `system.md`(제약 및 경계 정의), `prompt.md`(간결한 입력 슬라이스), `schema.json` & `contract.md`(군더더기 없는 확정형 JSON 출력 계약)를 갖추고 있으며, `npm run agents:validate` 명령을 통해 상호 배타적 쓰기 스코프(Disjoint Write Sets)를 물리적으로 검증하여 쓰기 충돌과 컨텍스트 오염을 원천 방지합니다.

---

## 목차

- [환경 및 연결 검증 결과](#환경-및-연결-검증-결과)
- [주요 핵심 기능](#주요-핵심-기능)
- [SAP Clean Core & Best Practice 다중 에이전트 협업 체계](#sap-clean-core--best-practice-다중-에이전트-협업-체계)
  - [SAP에서 Clean Core를 고수해야 하는 이유](#sap에서-clean-core를-고수해야-하는-이유)
  - [3대 Sub-Agent 역할 매트릭스 및 책임 분담](#3대-sub-agent-역할-매트릭스-및-책임-분담)
  - [엔드투엔드 협업 폐루프 파이프라인](#엔드투엔드-협업-폐루프-파이프라인)
- [AI 기반 Vibe Coding: 초고속 개발 및 배포·검증 일체화](#ai-기반-vibe-coding-초고속-개발-및-배포검증-일체화)
  - [SAP ABAP에서의 Vibe Coding이란?](#sap-abap에서의-vibe-coding이란)
  - [일체형 폐루프 워크플로우 (Read -> Edit -> Diagnose -> Deploy -> Verify)](#일체형-폐루프-워크플로우-read---edit---diagnose---deploy---verify)
  - [실제 Vibe Coding 대화형 실습 예시](#실제-vibe-coding-대화형-실습-예시)
- [대표 활용 사례 및 워크플로우](#대표-활용-사례-및-워크플로우)
  - [사례 1: 커스텀 리포트/프로그램 점검 및 소스 코드 검토](#사례-1-커스텀-리포트프로그램-점검-및-소스-코드-검토)
  - [사례 2: 오브젝트 영향도 분석 (Where-Used 역참조 추적)](#사례-2-오브젝트-영향도-분석-where-used-역참조-추적)
  - [사례 3: ABAP 실시간 구문 진단 및 빠른 수정](#사례-3-abap-실시간-구문-진단-및-빠른-수정)
  - [사례 4: 데이터 딕셔너리(DDIC) 온디맨드 탐색 및 조회](#사례-4-데이터-딕셔너리ddic-온디맨드-탐색-및-조회)
  - [사례 5: 개발 보조 및 코드 자동 완성 (Auto-Complete)](#사례-5-개발-보조-및-코드-자동-완성-auto-complete)
  - [사례 6: AI 기반 비즈니스 리포트 신속 구축 (ALV / CDS View)](#사례-6-ai-기반-비즈니스-리포트-신속-구축-alv--cds-view)
  - [사례 7: 규정 준수 검토 및 감사 추적 데이터 조회](#사례-7-규정-준수-검토-및-감사-추적-데이터-조회)
  - [사례 8: 테이블 간 동적 데이터 추출 및 경량 통합 분석](#사례-8-테이블-간-동적-데이터-추출-및-경량-통합-분석)
  - [사례 9: 고주기 정기 작업 오케스트레이션 및 자동 헬스체크](#사례-9-고주기-정기-작업-오케스트레이션-및-자동-헬스체크)
- [MCP 아키텍처 및 툴셋](#mcp-아키텍처-및-툴셋)
  - [적응형 프리셋 (Adaptive Preset)](#적응형-프리셋-adaptive-preset)
  - [온디맨드 동적 기능 탐색 (On-Demand Capabilities)](#온디맨드-동적-기능-탐색-on-demand-capabilities)
- [빠른 시작 (Quick Start)](#빠른-시작-quick-start)
  - [1. 의존성 설치](#1-의존성-설치)
  - [2. 연결 진단 및 헬스체크](#2-연결-진단-및-헬스체크)
  - [3. 프로토콜 및 기능 스모크 테스트](#3-프로토콜-및-기능-스모크-테스트)
  - [4. 코드 무결성 검증](#4-코드-무결성-검증)
  - [5. MCP 서비스 시작](#5-mcp-서비스-시작)
- [클라이언트 연동 설정 (Codex)](#클라이언트-연동-설정-codex)
- [보안 및 접근 제어](#보안-및-접근-제어)
- [문제 해결 (FAQ)](#문제-해결-faq)

---

## 환경 및 연결 검증 결과

### 1. SAP S/4HANA 시스템 정보
- **SAP Release**: `758` (SAP NetWeaver 7.58 기반 SAP S/4HANA)
- **System ID**: `S4H` (Client `100`, Logical System `S4HCLNT100`)
- **환경 (Environment)**: `development`
- **기본 언어**: `EN`
- **표준 시간대**: `UTC+8`

### 2. SAP WebGUI 로그인 검증
- **검증된 로그인 URL (HTTPS)**:
  ```text
  https://<sap-host>:44300/sap/bc/gui/sap/its/webgui?sap-client=100&sap-language=EN
  ```
- **로그인 상태**: 실측 검증 완료 (정상 로그인 확인).
- **HTTP 50099 포트 관련 안내**:
  HTTP 포트 `50099`를 통한 접근 시 SAP 시스템이 인증을 차단하고 다음 오류를 반환합니다:
  - `ICF_SYSTEM_LOGIN002`: Logon through HTTP is not possible; logon ticket is active for HTTPS only
  - `ICF_SYSTEM_LOGIN006`: No switch to HTTPS occurred, so it is not secure to send a password
  
  따라서 ICF 서비스 인증 및 패스워드 전송은 반드시 HTTPS로만 안전하게 수행되어야 합니다.

### 3. HTTPS 인증서 안내
현재 서버는 자체 서명 인증서를 사용 중이거나 특정 퍼블릭 도메인과 바인딩되지 않아 브라우저에서 "신뢰할 수 없는 인증서" 경고가 표시될 수 있습니다. 프로젝트 실행 스크립트는 자식 프로세스 범위 내에서 안전하게 인증서 우회 처리를 적용하여 글로벌 시스템 환경에 영향을 주지 않고 안전하게 통신합니다.

---

## SAP Clean Core & Best Practice 다중 에이전트 협업 체계

### SAP에서 Clean Core를 고수해야 하는 이유
과거 SAP ECC 및 초기 S/4HANA 커스터마이징 개발에서는 표준 코드에 브레이크포인트를 걸고 임플리싯 인핸스먼트(Implicit Enhancement)를 삽입하거나, 비릴리스 내부 함수 및 미가공 투명 테이블에 무분별하게 접근하는 관행이 팽배했습니다. 이는 시스템 업그레이드 시 수백 개의 구문 오류와 업무 로직 중단을 초래하며 막대한 "기술적 부채"로 이어졌습니다.

**SAP Clean Core 베스트 프랙티스**의 핵심 요구사항:
1. **코어 제로 수정 (Zero Modification Core)**: 표준 SAP 코드는 일체 수정하지 않습니다.
2. **모던 계층형 확장 아키텍처**:
   - **Tier 1 (ABAP Cloud On-Stack)**: 릴리스된 공식 API(Released APIs)와 CDS View만 활용하여 클라우드 네이티브 온스택 확장을 구현합니다.
   - **Tier 2 (Custom Isolation Layer)**: 불가피한 미릴리스 코어 호출은 전용 어댑터(Adapter/Wrapper) 클래스로 철저히 캡슐화 격리하고 리팩토링 백로그를 관리합니다.
   - **Tier 3 (Side-by-Side on SAP BTP)**: 무거운 대외 연계, 대규모 비동기 처리 및 이벤트 기반 확장은 클라우드 BTP 마이크로서비스로 분리합니다.
3. **모던 데이터 및 비즈니스 모델링**: CDS View Entities, 가상 데이터 모델(VDM), RAP(RESTful Application Programming Model)을 전면 도입합니다.

---

### 3대 Sub-Agent 역할 매트릭스 및 책임 분담

`agents/` 디렉토리 및 전역 `AGENTS.md`에 정의된 3대 Clean Core 전문 서브 에이전트가 유기적으로 협업합니다:

| Sub-Agent | 정의 및 지침 경로 | 핵심 역할 및 책임 | 핵심 MCP 도구셋 |
| :--- | :--- | :--- | :--- |
| **설계 에이전트**<br>*(Design Agent)* | [`agents/design-agent/AGENT.md`](agents/design-agent/AGENT.md) | **아키텍처 설계 및 규정 준수 검증**: 요구사항 타당성 검토, Clean Core 확장 등급(Tier 1/2/3) 결정, CDS View Entity 계층(Basic/Composite/Consumption) 및 인터페이스 계약 수립, 코어 침투적 설계 방지. | `sap.repository.search`<br>`sap.repository.inspect`<br>`sap.source.read`<br>`sap.system.inspect` |
| **개발 에이전트**<br>*(Dev Agent)* | [`agents/dev-agent/AGENT.md`](agents/dev-agent/AGENT.md) | **모던 ABAP Cloud 코딩 전문가**: 최신 ABAP Cloud 규약에 따른 구현(FORM/TABLES 등 폐기 문법 금지), 복잡한 조회를 CDS 엔티티로 푸시다운, 비즈니스 클래스 및 RAP 동작 구현, SAP 컴파일러 실시간 피드백을 통한 즉각적인 트러블슈팅. | `sap.source.diagnose`<br>`sap.source.read`<br>`sap.semantic.complete`<br>`sap.semantic.definition` |
| **테스트 에이전트**<br>*(Test Agent)* | [`agents/test-agent/AGENT.md`](agents/test-agent/AGENT.md) | **품질 보증 및 영향도 분석 전문가**: 전사 Where-Used 종속성 및 파급 범위 추적, Clean Core API 릴리스 규정 준수 감사, Test Double 격리를 적용한 고커버리지 모던 ABAP Unit 테스트 자동 작성. | `sap.repository.where_used`<br>`sap.source.diagnose`<br>`sap.source.search`<br>`sap.system.inspect` |

---

### 엔드투엔드 협업 폐루프 파이프라인

세 에이전트가 긴밀하게 상호작용하여 요구사항 접수부터 고품질 릴리스까지 이어지는 Clean Core 연구개발 루프를 형성합니다:

```text
                 ┌─────────────────────────────────────────────────────────────┐
                 │                 비즈니스 요구사항 / 변경 요청 제기           │
                 └──────────────────────────────┬──────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🏛️ 설계 에이전트 (Design Agent)                                                         │
  │ • sap.repository.inspect / search 도구로 기반 테이블 및 표준 CDS 구조 탐색              │
  │ • 확장 티어 확정 (Tier 1 클라우드 대응 / Tier 2 격리 어댑터 계층)                       │
  │ • 《SAP Clean Core 기술 아키텍처 설계서》 작성 (CDS 엔티티 계층 및 RAP 인터페이스 정의)  │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 💻 개발 에이전트 (Dev Agent)                                                            │
  │ • 설계서에 기반하여 모던 OO ABAP 클래스 및 CDS View Entities 작성                       │
  │ • SELECT * 사용 금지, @ 호스트 변수, 인라인 선언 및 표현식 적극 활용                    │
  │ • sap.source.diagnose 호출로 커널 컴파일 구문 실시간 진단, 0 Warning / 0 Error 달성     │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────────┐
  │ 🧪 테스트 에이전트 (Test Agent)                                                         │
  │ • sap.repository.where_used 호출로 시스템 전체 영향받는 프로그램/오브젝트 스캔          │
  │ • 모던 ABAP Unit 자동화 테스트 스위트 작성 (Test Double 활용 DB 및 외부 인터페이스 격리) │
  │ • Clean Core 릴리스 API 및 코드 품질 감사 수행, 《품질 테스트 및 규정 준수 보고서》 출력 │
  └─────────────────────────────────────────────┬───────────────────────────────────────────┘
                                                │
                                                ▼
                 ┌─────────────────────────────────────────────────────────────┐
                 │           100% Clean Core 준수 클라우드 대응 최종 산출물     │
                 └─────────────────────────────────────────────────────────────┘
```

---

## 주요 핵심 기능

AI 대화창에서 본 프로젝트의 MCP 도구를 호출함으로써 SAP GUI나 Eclipse ADT를 일일이 조작할 필요 없이 ABAP 라이프사이클 전반의 작업을 수행할 수 있습니다:

1. **시스템 프로파일링 및 연결 인지**: SAP 커널 버전, 시스템 유형, 클라이언트 역할, 표준 시간대 및 활성화된 ADT 엔드포인트를 즉각 확인.
2. **다차원 오브젝트 검색**: `PROG`(프로그램), `CLAS`(클래스), `INTF`(인터페이스), `TABL`(테이블), `VIEW`(뷰), `DDLS`(CDS 뷰), `DEVC`(패키지) 등에 대한 와일드카드 정밀/유사 검색.
3. **소스 코드 직접 읽기 및 AST 구조 탐색**: 활성 상태의 소스 코드를 무손실 조회(행 범위 페이징 지원), 클래스 메서드 구현 및 인클루드 계층 트리 탐색.
4. **실시간 정적 구문 진단**: SAP 커널 구문 검사기(SE38/ADT 구문 검사와 동일)를 원격 호출하여 오류 라인, 컬럼 및 메시지 내용을 정확히 포착.
5. **영향도 분석 및 종속성 추적**: 네이티브 Where-Used List 조회를 통해 특정 필드, 구조체, 메서드, 펑션의 전사 호출 지점을 완벽 추적.
6. **비즈니스 리포트 초고속 생성**: 실시간 테이블 구조 메타데이터와 결합하여 고품질 CDS View 또는 ALV IDA 리포트 코드를 생성하고 온라인 구문 진단 검증.
7. **감사 및 규정 준수 추적**: 시스템 변경 이력, 전송 요청(Transport Request), 수정 타임스탬프 및 핵심 설정 테이블 상태를 안전하게 검사.
8. **테이블 간 동적 데이터 추출 및 관계 매핑**: 복수 테이블 간 외래키 관계 및 데이터 딕셔너리 구조를 파악하여 정규화된 데이터 모델 생성.
9. **자동화 운영 및 배치 스케줄링 연동**: 정기 자동화 도구(Codex Automations / 스케줄러)와 결합하여 인터페이스 상태, 배치 작업, 시스템 건전성을 지속 점검.
10. **온디맨드 동적 기능 확장**: 필요에 따라 SAP ADT의 50여 가지 고급 기능(DDIC 메타데이터 조회, 퀵픽스, 코드 포맷팅, 단위 테스트 실행 등)을 동적으로 로드 및 실행.

---

## AI 기반 Vibe Coding: 초고속 개발 및 배포·검증 일체화

### SAP ABAP에서의 Vibe Coding이란?
전통적인 SAP ABAP 개발은 잦은 컨텍스트 스위칭을 동반했습니다. 개발자는 SAP GUI(SE38/SE80)나 Eclipse ADT, 요구사항 문서, 브라우저를 오가며 직접 테이블을 검색하고, OpenSQL을 조합하고, 구문 검사(Ctrl+F2)를 누르고, 활성화(Ctrl+F3) 후 수동 테스트를 반복해야 했습니다.

본 프로젝트의 로컬 MCP 연동을 활용하면 AI 코딩 어시스턴트(Codex 등) 내에서 진정한 **Vibe Coding**(자연어 기반 몰입형 코딩)을 경험할 수 있습니다:
- **완전한 자연어 대화**: “`Z07DRAUS`의 출력 형식을 PDF로 변경하고 구문 오류가 없는지 검증해 줘”
- **컨텍스트 전환 제로**: AI가 스스로 테이블 구조를 검색하고, 기존 코드를 파악하여 새로운 로직을 구현하고, SAP 원격 컴파일러를 통해 구문 검사 및 결과 검증까지 한 번에 완료.
- **분 단위의 신속한 구현**: 수 시간이 걸리던 테이블 조회 및 디버깅 작업을 단일 세션에서 수정-배포-검증 폐루프로 끝마칩니다.

---

### 일체형 폐루프 워크플로우 (Read -> Edit -> Diagnose -> Deploy -> Verify)

```text
[ 사용자가 자연어로 요구사항 제시 ]
         │
         ▼
[ 1. 의도 파악 및 시스템 환경 확인 ] ──> sap.system.inspect 호출
         │
         ▼
[ 2. 테이블 조회 및 컨텍스트 수집 ]  ──> sap.ddic.read / sap.source.read 호출
         │
         ▼
[ 3. 실시간 코드 생성 및 패치 구성 ] ──> ABAP 7.58 모던 문법으로 생성
         │
         ▼
[ 4. 원격 구문 컴파일 진단 수행 ]     ──> sap.source.diagnose 호출
         │
     ┌───┴────────────────┐
   경고/오류 발생       구문 정상 (0 Error)
     │                    │
     ▼                    ▼
[ 5. 자율 오류 수정 ]  [ 6. 안전한 배포 및 활성화 ] ──> 쓰기 도구 호출 ($TMP 화이트리스트)
                          │
                          ▼
                       [ 7. 검증된 최종 결과 인도 ]  ──> 사용자에게 보고
```

---

### 실제 Vibe Coding 대화형 실습 예시

#### 시나리오: 특정 리포트에 데이터 필터링 조건을 추가하고 온라인 검증 수행

**사용자 입력**:
> "테스트 패키지의 리포트 `ZA4WEEKINC`를 읽어서, 데이터 조회 부분에 회사 코드 `BUKRS = 1000` 필터를 추가해 줘. 수정한 코드가 SAP 구문 검사를 통과하는지도 바로 확인해 줘."

**AI가 백그라운드에서 자율 수행하는 절차**:
1. **소스 코드 자동 조회**:
   `sap.source.read(systemId: "S4H100", objectName: "ZA4WEEKINC", objectType: "PROG")`를 호출하여 기존 데이터 흐름 파악.
2. **수정 위치 분석 및 코드 패치 생성**:
   `SELECT` 구문을 찾아 변수 및 필드 타입에 맞게 `WHERE bukrs = 1000` 조건 추가.
3. **원격 구문 진단 및 검증**:
   `sap.source.diagnose`에 수정된 코드를 전달. 경고나 불일치 발생 시 밀리초 단위로 코드를 자동 보정하여 컴파일러 상태가 `succeeded`, `warnings: []`가 될 때까지 확인.
4. **최종 결과 전달**:
   수정된 코드 diff와 SAP 컴파일러 검증 통과 증적을 함께 제시 (전 과정 30초 내 완료).

---

## 대표 활용 사례 및 워크플로우

### 사례 1: 커스텀 리포트/프로그램 점검 및 소스 코드 검토
**상황**: 운영 또는 테스트 환경에서 커스텀 리포트 오류가 발생했을 때, SAP GUI 없이 빠르게 프로그램 로직을 검토해야 하는 경우.

- **AI 도구 호출 흐름**:
  1. `sap.repository.search`로 관련 프로그램 검색:
     ```json
     {
       "systemId": "S4H100",
       "pattern": "Z*",
       "objectTypes": ["PROG"],
       "limit": 5
     }
     ```
  2. 일치하는 프로그램(`ZA4WEEKINC` 등) 확인 후 `sap.source.read`로 핵심 로직 조회:
     ```json
     {
       "systemId": "S4H100",
       "objectName": "ZA4WEEKINC",
       "objectType": "PROG",
       "startLine": 1,
       "lineCount": 50
     }
     ```
- **실제 가치**: AI가 대화창 내에서 소스 코드를 직접 읽고 데이터 흐름을 분석하며 잠재적 취약점을 지적해 줍니다.

---

### 사례 2: 오브젝트 영향도 분석 (Where-Used 역참조 추적)
**상황**: 글로벌 구조체나 메서드, 펑션의 시그니처를 리팩토링하기 전 영향받는 상하위 모듈 범위를 평가해야 하는 경우.

- **AI 도구 호출 흐름**:
  `sap.repository.where_used` 호출:
  ```json
  {
    "systemId": "S4H100",
    "objectName": "ZMY_DATA_STRUCT",
    "objectType": "TABL",
    "limit": 20
  }
  ```
- **실제 가치**: 해당 오브젝트를 참조하는 모든 리포트, 클래스 메서드, 펑션 모듈을 즉시 반환하며, AI가 영향도 요약 및 리그레션 테스트 범위를 도출합니다.

---

### 사례 3: ABAP 실시간 구문 진단 및 빠른 수정
**상황**: ABAP 코드를 작성 또는 수정한 후 대상 시스템에서 오류 없이 컴파일되는지 확인하고 폐기 문법이나 타입 불일치를 해결해야 하는 경우.

- **AI 도구 호출 흐름**:
  `sap.source.diagnose` 호출:
  ```json
  {
    "systemId": "S4H100",
    "fileUri": "adt://s4h100/sap/bc/adt/programs/programs/za4weekinc"
  }
  ```
- **실제 가치**: SAP 컴파일러가 반환하는 정확한 오류 라인, 컬럼 번호, 메시지 코드를 수신하여 AI가 즉각적인 수정 패치를 제시합니다.

---

### 사례 4: 데이터 딕셔너리(DDIC) 온디맨드 탐색 및 조회
**상황**: 표준 테이블(`MARA`, `VBAK`)이나 커스텀 테이블의 필드 타입, 기본키, 외래키 관계를 파악해야 하는 경우.

- **AI 도구 호출 흐름**:
  1. `sap.capability.search`로 테이블 도구 검색:
     ```json
     { "query": "table" }
     ```
     일치 도구: `sap.ddic.read`.
  2. 파라미터 스키마 확인:
     ```json
     { "name": "sap.ddic.read" }
     ```
  3. 읽기 호출 실행:
     ```json
     {
       "name": "sap.ddic.read",
       "schemaHash": "<hash>",
       "arguments": {
         "systemId": "S4H100",
         "objectName": "VBAK",
         "objectType": "TABL"
       }
     }
     ```
- **실제 가치**: 테이블 메타데이터를 즉시 획득하여 AI가 정확하고 안전한 OpenSQL/ABAP SQL 코드를 작성합니다.

---

### 사례 5: 개발 보조 및 코드 자동 완성 (Auto-Complete)
**상황**: 표준 클래스나 BAPI 호출 시 정확한 매개변수 명칭과 타입을 확인해야 하는 경우.

- **AI 도구 호출 흐름**:
  `sap.semantic.complete` 또는 `sap.semantic.definition`에 라인/컬럼 번호와 URI를 전달.
- **실제 가치**: `IMPORTING`, `EXPORTING`, `CHANGING` 파라미터를 정확하게 자동 완성하여 오타로 인한 재작업을 방지합니다.

---

### 사례 6: AI 기반 비즈니스 리포트 신속 구축 (ALV / CDS View)
**상황**: 영업오더 이행 상태 분석 리포트 등 긴급 리포트 요구사항을 빠르게 개발해야 하는 경우.

- **AI 도구 호출 흐름**:
  1. **메타데이터 조회**: AI가 `sap.ddic.read`를 호출하여 `VBAK`, `VBAP`, `VBUK` 구조 획득.
  2. **모델 생성**: 연관 관계(Association) 및 UI 어노테이션이 포함된 모던 CDS View Entity 코드 자동 생성:
     ```abap
     @AbapCatalog.sqlViewName: Z_VBAK_REP
     define view Z_I_SalesPerformance as select from vbak
       association [1..*] to vbap as _Item on vbak.vbeln = _Item.vbeln { ... }
     ```
  3. **실시간 검증**: `sap.source.diagnose`를 호출하여 구문 적합성 즉시 확인.
- **실제 가치**: 수 시간이 소요되던 작업을 1분 이내로 단축하여 실시간 프로토타입 및 프로덕션 코드를 완성합니다.

---

### 사례 7: 규정 준수 검토 및 감사 추적 데이터 조회
**상황**: 감사 부서에서 커스텀 코드 변경 이력, 권한 검사 누락 여부, 전송 요청 범위를 점검해야 하는 경우.

- **AI 도구 호출 흐름**:
  1. **변경 감사**: `sap.repository.inspect`로 작성자(`createdBy`), 수정자(`changedBy`), 타임스탬프, 전송 번호 확인.
  2. **민감 패턴 검색**: `sap.source.search`를 통해 전체 `Z*` 코드에서 권한 검사 로직 검색:
     ```json
     {
       "systemId": "S4H100",
       "searchTerm": "AUTHORITY-CHECK",
       "objectName": "Z*"
     }
     ```
  3. **보고서 출력**: AI가 감사 체크리스트 및 권한 검사 커버리지 보고서 생성.
- **실제 가치**: 블랙박스 위험을 제거하고 코드 거버넌스를 자동화합니다.

---

### 사례 8: 테이블 간 동적 데이터 추출 및 경량 통합 분석
**상황**: 외부 시스템이나 대시보드 연동을 위해 자재 마스터(`MARA`, `MARC`, `MARD`) 간 연계 구조와 추출 정의서가 필요한 경우.

- **AI 도구 호출 흐름**:
  1. `sap.ddic.read`로 기본키/외래키 무결성 관계 자동 분석.
  2. 읽기 허용 모드에서 샘플 데이터 구조 검증.
  3. 다운스트림 연계 스크립트(Python Pandas, Spark, OData 컨슈머 코드) 생성.
- **실제 가치**: SAP 필드 축약어 오해로 인한 데이터 정제 오류를 방지합니다.

---

### 사례 9: 고주기 정기 작업 오케스트레이션 및 자동 헬스체크
**상황**: 핵심 인터페이스 및 ADT 연결성, 주요 프로그램 패키지의 건전성을 주기적으로 자동 점검해야 하는 경우.

- **AI 도구 호출 흐름**:
  1. 자동화 스케줄러(Codex Automations 등)와 연계하여 `sap.system.inspect`로 응답 지연 및 상태 주기적 확인.
  2. `sap.source.diagnose`로 핵심 패키지에 컴파일 오류가 유입되지 않았는지 모니터링.
  3. 이상 발생 시 담당자에게 즉시 경고 알림 전송.
- **실제 가치**: 일상적인 수동 점검을 24시간 자동화된 안전망으로 전환합니다.

---

## MCP 아키텍처 및 툴셋

본 프로젝트는 `@coaspe/sap-abap-mcp@1.6.0`을 기반으로 구축되었으며 `--preset adaptive` 모드를 채택하고 있습니다.

### 적응형 프리셋 (Adaptive Preset)
기본적으로 17개의 핵심 도구를 노출하여 시스템 점검, 레포지토리 검색, AST 분석 및 구문 진단을 지원합니다:

| 카테고리 | MCP 도구 명칭 | 기능 설명 |
| :--- | :--- | :--- |
| **시스템 점검** | `sap.system.list` | 구성된 SAP 시스템 ID 및 로컬 자격증명 상태 목록 조회 |
| | `sap.system.inspect` | 시스템 버전, 클라이언트, 표준 시간대 및 컴포넌트 메타데이터 조회 |
| | `sap.system.capabilities` | 시스템이 지원 및 인가한 기능 세트 확인 |
| **레포지토리 및 오브젝트** | `sap.repository.search` | 이름 패턴 및 유형별 ABAP 레포지토리 오브젝트 검색 |
| | `sap.repository.resolve` | 오브젝트를 정규 ADT 리소스 URI로 변환 |
| | `sap.repository.inspect` | 오브젝트 메타데이터, ADT 구조 및 하위 노드 확인 |
| | `sap.repository.where_used` | ABAP 오브젝트의 역참조(Where-Used) 관계 조회 |
| **소스 및 구문** | `sap.source.read` | 지정된 범위의 활성 ABAP/CDS 소스 코드 조회 |
| | `sap.source.diagnose` | 실시간 SAP 구문 진단(Syntax Check) 실행 |
| | `sap.source.search` | ABAP 소스 내 문자열 또는 정규표현식 검색 |
| **시맨틱 및 자동 완성** | `sap.semantic.complete` | ABAP 코드 자동 완성 추천 및 엘리먼트 세부 정보 확인 |
| | `sap.semantic.definition` | 정의 및 구현 위치 탐색 (Go to Definition) |
| **동적 기능 호출** | `sap.capability.search` | 기본 목록 외 50여 가지 전체 SAP 확장 기능 라이브러리 검색 |
| | `sap.capability.describe` | 확장 기능의 파라미터 스키마 및 해시 검증값 확인 |
| | `sap.capability.invoke_read` | 읽기 전용 확장 기능 호출 |
| | `sap.capability.invoke_write` | 제어된 쓰기 기능 호출 |
| | `sap.capability.invoke_destructive` | 파괴적 작업 기능 호출 (권한 제어 적용) |

### 온디맨드 동적 기능 탐색 (On-Demand Capabilities)
사용 빈도가 낮은 기능(DDIC 테이블 구조 조회 `sap.ddic.read`, 전송 요청 분석 등)은 `sap.capability.search` ➔ `sap.capability.describe` ➔ `sap.capability.invoke_*` 순서로 동적 탐색하여 호출함으로써 대규모 프롬프트 컨텍스트 낭비를 방지합니다.

---

## 빠른 시작 (Quick Start)

### 1. 의존성 설치
```bash
npm install
```

### 2. 연결 진단 및 헬스체크
로컬 설정 파일이 올바른지 확인하고 ADT 검색 엔드포인트(`/sap/bc/adt/discovery`) 통신을 테스트합니다:
```bash
npm run mcp:doctor
```
> 출력에 `ok: true`, Release(`758`), Client(`100`)이 표시되면 정상 연결 상태입니다.

### 3. 프로토콜 및 기능 스모크 테스트
MCP 핸드셰이크, 도구 등록, 시스템 정보 조회 및 오브젝트 검색을 포함한 엔드투엔드 테스트를 실행합니다:
```bash
npm run mcp:smoke
```

### 4. 코드 무결성 검증
스크립트 구문 검사 및 스모크 테스트를 일괄 실행합니다:
```bash
npm run check
```

### 5. MCP 서비스 시작
Stdio 모드로 MCP 서버를 직접 시작합니다 (외부 디버깅 또는 연동용):
```bash
npm run mcp:start
```

---

## 클라이언트 연동 설정 (Codex)

`.codex/config.toml`에 프로젝트 전용 MCP 서버가 사전 설정되어 있어 새로운 Codex 작업 시 `sap_abap` 도구셋이 자동으로 활성화됩니다:

```toml
[mcp_servers.sap_abap]
command = "/opt/homebrew/bin/node"
args = [
  "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop/scripts/sap-mcp-runner.mjs",
  "serve",
  "--profile",
  "S4H100",
  "--preset",
  "adaptive",
  "--audit-log",
  "stderr",
]
cwd = "/Users/mz/Documents/ChatGPT/hand-in-sap-s4hop"
startup_timeout_sec = 120
tool_timeout_sec = 180
```

설정 템플릿 파일은 `config/codex-mcp.toml.example`에 마련되어 있습니다.

---

## 보안 및 접근 제어

1. **자격 증명 보호**
   - 실제 패스워드는 Git에서 무시되는 `SAP_CONNECTION.local.md`에만 보관됩니다.
   - 마스킹된 예시 템플릿은 `SAP_CONNECTION.example.md`로 제공됩니다.
   - 런타임 설정 디렉토리 `.sap-abap-mcp/` 역시 Git에서 제외됩니다.
2. **쓰기 권한 격리**
   - 기본적으로 로컬 테스트 패키지인 `$TMP`에 대해서만 쓰기가 허용됩니다.
   - 패키지 권한을 확장하려면 `SAP_CONNECTION.local.md`의 `Writable packages` 항목을 수정합니다.
3. **데이터 조회 통제**
   - 임의의 SAP SQL 쿼리 실행 기능은 기본적으로 비활성화되어 있습니다 (`Allow data queries: false`).
4. **의존성 고정**
   - `@coaspe/sap-abap-mcp@1.6.0` 및 `@modelcontextprotocol/sdk@1.30.0` 버전을 고정하여 예기치 않은 스키마 변경을 방지합니다.

---

## 문제 해결 (FAQ)

### Q1: `mcp:doctor` 실행 시 TLS/SSL 경고가 발생합니다.
경고 메시지:
```text
Warning: Setting the NODE_TLS_REJECT_UNAUTHORIZED environment variable to '0' makes TLS connections and HTTPS requests insecure...
```
**원인 및 조치**: 현재 SAP 인스턴스가 자체 서명 인증서를 사용하고 있어 실행 스크립트가 해당 자식 프로세스에 한해 HTTPS 연결을 허용하도록 설정되었습니다. 이후 공식 CA 인증서가 설치되면 엄격한 검증 모드로 복원할 수 있습니다.

### Q2: 왜 HTTP 50099 포트를 사용할 수 없나요?
SAP 인스턴스에 보안 정책이 적용되어 로그온 티켓(Logon Ticket) 발급이 HTTPS(`44300`)로만 제한되어 있습니다. HTTP 포트는 패스워드 인증을 명시적으로 거부합니다.

### Q3: 설정을 변경했는데 Codex에 반영되지 않습니다.
Codex는 세션 시작 시 `.codex/config.toml`을 한 번 로드합니다. 설정을 수정한 후 새 작업을 생성하거나 세션을 다시 열어 최신 도구셋을 불러오십시오.
