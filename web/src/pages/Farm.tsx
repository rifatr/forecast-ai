import { useEffect, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { CircleAlert } from 'lucide-react';
import { analyzeFarmImage, getFarmHistory, getFarmQuota } from '../api/farm';
import { FarmAnalysisHistory } from '../components/farm/FarmAnalysisHistory';
import { FarmAnalysisResult } from '../components/farm/FarmAnalysisResult';
import { FarmQuotaCard } from '../components/farm/FarmQuotaCard';
import { FarmUploadForm } from '../components/farm/FarmUploadForm';
import type { FarmAnalysis, FarmAnalysisInput, FarmQuota } from '../types/farm';

const EMPTY_INPUT: FarmAnalysisInput = {
  county: '',
  landAcres: '',
  location: '',
  notes: '',
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export function Farm() {
  const [details, setDetails] = useState<FarmAnalysisInput>(EMPTY_INPUT);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FarmAnalysis | null>(null);
  const [history, setHistory] = useState<FarmAnalysis[]>([]);
  const [quota, setQuota] = useState<FarmQuota | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadFarmData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function loadFarmData() {
    setIsLoadingData(true);

    const [quotaResult, historyResult] = await Promise.allSettled([
      getFarmQuota(),
      getFarmHistory(),
    ]);

    if (quotaResult.status === 'fulfilled') {
      setQuota(quotaResult.value);
    }

    if (historyResult.status === 'fulfilled') {
      setHistory(historyResult.value.data);
    }

    if (quotaResult.status === 'rejected' && historyResult.status === 'rejected') {
      setError('Farm AI data is temporarily unavailable. You can still prepare an analysis request.');
    }

    setIsLoadingData(false);
  }

  function updateDetail(field: keyof FarmAnalysisInput, value: string) {
    setDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError('Use a JPEG or PNG image.');
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      setError('The image must be 10 MB or smaller.');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError('Select a farm image before starting the analysis.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeFarmImage(file, details);

      setAnalysis(result);
      setHistory((currentHistory) => [
        result,
        ...currentHistory.filter((item) => item.analysis_id !== result.analysis_id),
      ]);
      void loadFarmData();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'The image could not be analyzed.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  function clearSelectedImage() {
    setFile(null);
    setPreviewUrl(null);
  }

  function handleAnalyzeAgain() {
    setAnalysis(null);
    clearSelectedImage();
  }

  return (
    <div className="farm-page animate-fade-in">
      <header className="farm-header">
        <div>
          <p className="eyebrow">Farm intelligence</p>
          <h1>Tree health analysis</h1>
          <p>
            Upload a recent farm image to estimate tree count, canopy coverage, and areas that
            need attention.
          </p>
        </div>
        <FarmQuotaCard quota={quota} isLoading={isLoadingData} />
      </header>

      {error && (
        <div className="inline-alert farm-alert">
          <CircleAlert size={18} />
          {error}
        </div>
      )}

      {analysis ? (
        <FarmAnalysisResult 
          analysis={analysis} 
          onAnalyzeAgain={handleAnalyzeAgain} 
        />
      ) : (
        <FarmUploadForm
          details={details}
          previewUrl={previewUrl}
          isAnalyzing={isAnalyzing}
          onDetailChange={updateDetail}
          onFileChange={handleFileChange}
          onRemoveImage={clearSelectedImage}
          onSubmit={handleSubmit}
        />
      )}

      <FarmAnalysisHistory
        analyses={history}
        isLoading={isLoadingData}
        onRefresh={() => void loadFarmData()}
        onSelect={setAnalysis}
      />
    </div>
  );
}
