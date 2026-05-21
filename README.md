# acttub

acttub 서비스 전체를 한눈에 보는 umbrella 레포지토리입니다.
각 서브프로젝트는 **독립된 GitHub 레포지토리**로 운영되며, 이 레포는 git submodule로 그 위치를 가리킬 뿐입니다.

> **배포에 영향 없음.** Vercel은 각 서브프로젝트의 원본 레포(`acttub/thea`, `acttub/comm` 등)의 `main`을 그대로 바라보고 있고, 이 umbrella 레포는 그 흐름에 끼어들지 않습니다.

## 구성

| 서브프로젝트 | 설명 | 원본 레포 | 배포 URL |
|---|---|---|---|
| `acttub-landing` | 메인 랜딩 페이지 | [acttub/acttub-landing](https://github.com/acttub/acttub-landing) | https://www.acttub.com |
| `thea` | 연극 추천 도구 | [acttub/thea](https://github.com/acttub/thea) | https://www.acttub.com/thea |
| `comm` | 커뮤니티 | [acttub/comm](https://github.com/acttub/comm) | https://www.acttub.com/community |
| `ACTI` | 연기 스타일 MBTI | [acttub/ACTI](https://github.com/acttub/ACTI) | acttub.com |
| `excer` | 서울 연습실 지도 | [acttub/excer](https://github.com/acttub/excer) | acttub.com/excer |
| `arch` | 연기 영상 아카이브 | [acttub/arch](https://github.com/acttub/arch) | - |

기획/내부 문서 전용 레포(`acttub/second_brain`)는 이 umbrella에 포함하지 않습니다.

## 클론 방법

전체 한 번에:

```bash
git clone --recursive https://github.com/acttub/acttub.git
```

이미 클론한 뒤 서브모듈만 받기:

```bash
git submodule update --init --recursive
```

## 일상 작업 흐름

개별 서브프로젝트의 코드를 수정할 때는 **항상 해당 서브프로젝트 디렉토리 안에서** 평소처럼 작업하세요. Vercel은 그 레포의 `main`을 보고 있습니다.

```bash
cd thea
# ... 수정 ...
git add . && git commit -m "..."
git push origin main      # → Vercel 자동배포 트리거
```

umbrella 레포가 가리키는 커밋 포인터를 최신으로 올리고 싶다면 (선택사항):

```bash
# 루트에서
git submodule update --remote --merge
git add <서브프로젝트명>
git commit -m "chore: bump <서브프로젝트명> pointer"
git push
```

umbrella의 포인터를 올리지 않아도 각 서브프로젝트는 독립적으로 동작합니다. 포인터 갱신은 "이 시점의 모든 서브프로젝트 상태"를 한 커밋으로 스냅샷 찍고 싶을 때만 하면 됩니다.

## 새 서브프로젝트 추가

```bash
git submodule add https://github.com/acttub/<new-repo>.git <new-repo>
git commit -m "feat: add <new-repo> submodule"
git push
```
