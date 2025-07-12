import MedicalHistory from '@/components/dashboard/my-health/MedicalHistory';
import Prescriptions from '@/components/dashboard/my-health/Prescriptions';
import Reports from '@/components/dashboard/my-health/Reports';
import UploadedFiles from '@/components/dashboard/my-health/UploadedFiles';

export default function MyHealthPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">My Health</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MedicalHistory />
        <Prescriptions />
        <Reports />
        <UploadedFiles />
      </div>
    </div>
  );
} 