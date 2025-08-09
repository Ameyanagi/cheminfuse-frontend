import React, { useState, useEffect } from "react";
import { Jsme } from "jsme-react";
import Link from "next/link";
import { torchaniAPI, JobStatusResponse } from "@/lib/api";

interface ProgressBarProps {
  progress: number;
  status: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{status}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

function ImprovedMolEditor() {
  const [smiles, setSmiles] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modelInfo, setModelInfo] = useState<any>(null);

  useEffect(() => {
    // Fetch available models on mount
    torchaniAPI.listModels()
      .then(setModelInfo)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Poll job status
    if (jobId && isProcessing) {
      const pollInterval = setInterval(async () => {
        try {
          const status = await torchaniAPI.getJobStatus(jobId);
          setJobStatus(status);

          if (status.status === 'completed') {
            setIsProcessing(false);
            // Download results
            if (status.result) {
              await torchaniAPI.downloadResultsAsCSV(
                status.result,
                `${smiles.replace(/[^a-zA-Z0-9]/g, '_')}_optimized.csv`
              );
            }
          } else if (status.status === 'failed') {
            setIsProcessing(false);
            setError(status.error || 'Optimization failed');
          }
        } catch (err) {
          console.error('Failed to get job status:', err);
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    }
  }, [jobId, isProcessing, smiles]);

  const handleSmiles = (newSmiles: string) => {
    setSmiles(newSmiles);
    setError(null);
  };

  const handleSmilesInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmiles(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!smiles) {
      setError("Please enter a SMILES string or draw a molecule");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setJobStatus(null);

    try {
      // Submit job to new API
      const response = await torchaniAPI.submitJob({
        smiles,
        max_steps: 1000,
        fmax: 1e-6,
        optimizer: 'LBFGS',
      });

      setJobId(response.job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit job');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full text-left">
      <div className="w-full p-10">
        <div className="max-w-[1240px] mx-auto">
          <p className="text-xl tracking widget uppercase text-[#5651e5] py-4">
            Structure Optimization using Neural Network Potentials
          </p>

          {/* Model Status */}
          {modelInfo && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold mb-2">GPU Status</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Device: {modelInfo.gpu_stats.device}</div>
                <div>Memory Usage: {(modelInfo.gpu_stats.memory_usage * 100).toFixed(1)}%</div>
                <div>Models Loaded: {modelInfo.gpu_stats.models_loaded}/{modelInfo.gpu_stats.max_models}</div>
                <div>Available Models: {Object.keys(modelInfo.models).join(', ')}</div>
              </div>
            </div>
          )}

          <div className="text-xl mb-4">
            <strong>How to use:</strong>
            <ol className="list-decimal ml-6 mt-2">
              <li>Draw your molecule in the editor or enter SMILES in the textbox</li>
              <li>Press "Submit Structure"</li>
              <li>Monitor the optimization progress</li>
              <li>The optimized structure will be downloaded automatically as a CSV file</li>
              <li>Upload the CSV file to <Link href="/tools/structure_visualization" className="text-[#5651e5] hover:underline">Structure Visualization</Link> page</li>
            </ol>
          </div>

          <div className='p-4'>
            <Jsme 
              src="/jsme/jsme.nocache.js" 
              height="50vh" 
              width="100%" 
              options="oldlook,star" 
              onChange={handleSmiles} 
            />
            
            <form onSubmit={handleSubmit}>
              <div className='flex flex-col mt-4'>
                <label className='uppercase text-sm py-2'>SMILES</label>
                <input
                  className='border-2 rounded-lg p-3 flex border-gray-300'
                  type='text'
                  name='smiles'
                  value={smiles}
                  onChange={handleSmilesInput}
                  disabled={isProcessing}
                />
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {jobStatus && (
                <div className="mt-4">
                  <ProgressBar 
                    progress={jobStatus.progress} 
                    status={jobStatus.status}
                  />
                  
                  {jobStatus.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      ✓ Optimization completed successfully! Your results have been downloaded.
                    </div>
                  )}
                </div>
              )}

              <button 
                className='w-full p-4 text-gray-100 mt-4 disabled:opacity-50 disabled:cursor-not-allowed' 
                disabled={isProcessing || !smiles}
                type="submit"
              >
                {isProcessing ? 'Processing...' : 'Submit Structure'}
              </button>
            </form>
          </div>

          <div className="py-10 text-xl">
            <strong>Technical Details:</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>4000 random conformers generated using RDKit</li>
              <li>MMFF94 energy minimization for initial optimization</li>
              <li>G-means clustering (max 10 groups)</li>
              <li>TorchANI optimization with GPU acceleration</li>
              <li>Elements supported (ANI-1ccx): H, C, N, O</li>
              <li>Elements supported (ANI-2x): H, C, N, O, S, F, Cl</li>
              <li>Charges are not supported</li>
            </ul>
          </div>

          <div className="text-xl">
            <strong>Blog post:</strong> <Link href="/posts/structure-optimization" className="text-[#5651e5] hover:underline">
              Learn more about neural network potentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImprovedMolEditor;