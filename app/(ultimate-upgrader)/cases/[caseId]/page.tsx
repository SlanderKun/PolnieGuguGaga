import CaseDetail from '../../components/CaseDetail';

export default async function CasePage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  return <CaseDetail caseId={caseId} />;
}
