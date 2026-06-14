import QuickTestPage from '../../views/QuickTestPage';

export const metadata = {
  title: 'acttub 빠른 테스트',
  description: '대본을 준비할 필요 없이, 정해진 대사 한 마디를 연기하면 AI가 바로 분석해 주는 acttub 빠른 테스트',
};

// acttub.com/test — coach 진입 장벽(대본·의도 준비)을 없앤 체험판.
// 정해진 대사·의도를 시스템이 주입하고 분석은 /coach 메인과 동일한 v2 파이프라인을 재사용한다.
export default function Page() {
  return <QuickTestPage />;
}
