# acttub

acttub 전체 서비스의 **모노레포**입니다. 각 서브프로젝트는 이 레포의 하위 디렉토리로 들어있고, 히스토리도 보존되어 있습니다.

## 구성

| 디렉토리 | 설명 | 배포 URL |
|---|---|---|
| [`acttub-landing/`](./acttub-landing) | 메인 랜딩 페이지 | https://www.acttub.com |
| [`thea/`](./thea) | 연극 추천 도구 | https://www.acttub.com/thea |
| [`comm/`](./comm) | 커뮤니티 | https://www.acttub.com/community |
| [`ACTI/`](./ACTI) | 연기 스타일 MBTI | acttub.com |
| [`excer/`](./excer) | 서울 연습실 지도 | acttub.com/excer |
| [`arch/`](./arch) | 연기 영상 아카이브 | - |

기획/내부 문서 전용 레포(`acttub/second_brain`)는 이 모노레포에 포함하지 않습니다.

## 작업 방법

각 서브프로젝트는 **독립적인 앱**이지만, 로컬 개발 도구는 루트 pnpm workspace에서 통합 관리합니다. 대부분은 Next.js 앱이며, `ACTI/`는 Vite React 앱, `acttub-landing/`은 정적 페이지입니다.

```bash
git clone https://github.com/acttub/acttub.git
cd acttub
corepack pnpm install
corepack pnpm local
```

자주 쓰는 루트 명령:

| 명령 | 설명 |
|---|---|
| `corepack pnpm local` | `localhost:4000`에서 landing은 로컬, 하위 앱 경로는 Vercel 배포본으로 프록시 |
| `corepack pnpm local:acti` | `ACTI/` Vite 앱 실행 |
| `corepack pnpm local:thea` | `/thea` basePath로 thea 실행 |
| `corepack pnpm local:comm` | `/community` basePath로 comm 실행 |
| `corepack pnpm local:arch` | `/archive` basePath로 arch 실행 |
| `corepack pnpm local:excer` | `/excer` basePath로 excer 실행 |
| `corepack pnpm prod` | workspace 전체 production build 실행 |
| `corepack pnpm prod:thea` | `thea/`만 production build 실행 |
| `corepack pnpm lint` | workspace 내 lint 스크립트 실행 |
| `corepack pnpm test` | workspace 내 test 스크립트 실행 |

`pnpm` shim을 활성화한 환경에서는 `corepack pnpm` 대신 `pnpm`만 입력해도 됩니다. `comm`, `arch`, `excer`는 로컬 실행/빌드 시 앱별 `.env.local` 값이 필요할 수 있습니다.

수정 → 커밋 → main에 푸시하면 Vercel이 각 프로젝트의 Root Directory를 보고 변경분에 해당하는 프로젝트만 배포합니다.

## Vercel 배포 설정

Vercel은 한 GitHub 레포 안의 여러 디렉토리를 각각 별도 프로젝트로 배포할 수 있습니다. 각 Vercel 프로젝트가 자기 서브디렉토리의 `package.json`을 보도록 다음과 같이 설정되어 있습니다:

| Vercel 프로젝트 | Repository | Root Directory |
|---|---|---|
| acttub-landing | `acttub/acttub` | `acttub-landing` |
| thea | `acttub/acttub` | `thea` |
| comm | `acttub/acttub` | `comm` |
| ACTI | `acttub/acttub` | `ACTI` |
| excer | `acttub/acttub` | `excer` |

Vercel은 **변경된 파일이 해당 Root Directory 하위에 있을 때만** 그 프로젝트를 재배포합니다 (Ignored Build Step 기본 동작). 따라서 한 모노레포 안에 있어도 서로 다른 프로젝트끼리 배포가 간섭하지 않습니다.

## 새 서브프로젝트 추가

```bash
mkdir new-project
cd new-project
# Next.js 등 원하는 프레임워크 setup
git add . && git commit -m "feat: add new-project"
git push
```

이후 Vercel 대시보드에서 New Project → `acttub/acttub` import → Root Directory를 `new-project`로 지정.

## 히스토리

각 서브프로젝트가 통합되기 전 독립 레포로 운영되던 시기의 커밋도 모두 이 레포 히스토리에 보존되어 있습니다 (git subtree merge). 원본 레포(`acttub/thea` 등)는 archive 처리되어 read-only 상태로 남아있습니다.
