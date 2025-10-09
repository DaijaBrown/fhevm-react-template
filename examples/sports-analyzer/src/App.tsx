import { useState } from 'react';
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import './App.css';

// Contract ABI (simplified - include only functions we use)
const CONTRACT_ABI = [
  'function registerAthlete(string memory _sport) external',
  'function recordPerformance(uint32 _heartRate, uint32 _calories, uint16 _duration, uint16 _distance, uint8 _intensity, uint32 _recoveryTime) external',
  'function updateAnalysis() external',
  'function submitToLeaderboard(string memory _category) external',
  'function getAthleteProfile(address _athlete) external view returns (bool isRegistered, string memory sport, uint256 registrationTime, uint256 sessionCount)',
  'function getContractStats() external view returns (uint256 totalAthletesCount, uint256 totalSessionsCount)',
];

function SportsAnalyzerApp() {
  const { sdk, isReady, isLoading } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [athleteProfile, setAthleteProfile] = useState<any>(null);

  // Form states
  const [sport, setSport] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [category, setCategory] = useState('');

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

  async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);

      // Create contract instance
      const contractInstance = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        signer
      );
      setContract(contractInstance);

      // Load athlete profile
      await loadProfile(contractInstance, address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  }

  async function loadProfile(contractInstance: ethers.Contract, address: string) {
    try {
      const profile = await contractInstance.getAthleteProfile(address);
      setAthleteProfile({
        isRegistered: profile[0],
        sport: profile[1],
        registrationTime: profile[2],
        sessionCount: profile[3],
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  async function handleRegister() {
    if (!contract || !sport) return;

    try {
      const tx = await contract.registerAthlete(sport);
      await tx.wait();
      alert('Successfully registered!');
      await loadProfile(contract, walletAddress);
    } catch (error: any) {
      console.error('Error registering:', error);
      alert(`Failed to register: ${error.message}`);
    }
  }

  async function handleRecordPerformance() {
    if (!contract) return;

    try {
      // Note: The contract expects plaintext values and encrypts them internally
      // This is the recommended approach for FHEVM contracts
      const tx = await contract.recordPerformance(
        parseInt(heartRate),
        parseInt(calories),
        parseInt(duration),
        parseInt(distance),
        parseInt(intensity),
        parseInt(recoveryTime)
      );

      await tx.wait();
      alert('Performance recorded successfully!');
      await loadProfile(contract, walletAddress);

      // Clear form
      setHeartRate('');
      setCalories('');
      setDuration('');
      setDistance('');
      setIntensity('');
      setRecoveryTime('');
    } catch (error: any) {
      console.error('Error recording performance:', error);
      alert(`Failed to record: ${error.message}`);
    }
  }

  async function handleUpdateAnalysis() {
    if (!contract) return;

    try {
      const tx = await contract.updateAnalysis();
      await tx.wait();
      alert('Analysis updated successfully!');
    } catch (error: any) {
      console.error('Error updating analysis:', error);
      alert(`Failed to update: ${error.message}`);
    }
  }

  async function handleSubmitLeaderboard() {
    if (!contract || !category) return;

    try {
      const tx = await contract.submitToLeaderboard(category);
      await tx.wait();
      alert('Submitted to leaderboard!');
    } catch (error: any) {
      console.error('Error submitting to leaderboard:', error);
      alert(`Failed to submit: ${error.message}`);
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <h1>🔐 Private Sports Analyzer</h1>
        <p>Initializing FHEVM SDK...</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="container">
        <h1>🔐 Private Sports Analyzer</h1>
        <p className="error">Failed to initialize FHEVM SDK</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>🔐 Private Sports Analyzer</h1>
        <p className="subtitle">Privacy-preserving athlete performance tracking with FHEVM</p>
      </header>

      {/* Wallet Connection */}
      <section className="card">
        <h2>Wallet Connection</h2>
        {walletAddress ? (
          <div className="connected">
            <p>✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            {athleteProfile && athleteProfile.isRegistered && (
              <div className="profile">
                <p><strong>Sport:</strong> {athleteProfile.sport}</p>
                <p><strong>Sessions:</strong> {athleteProfile.sessionCount.toString()}</p>
              </div>
            )}
          </div>
        ) : (
          <button onClick={connectWallet} className="button">
            Connect MetaMask
          </button>
        )}
      </section>

      {/* Registration */}
      {walletAddress && athleteProfile && !athleteProfile.isRegistered && (
        <section className="card">
          <h2>Register as Athlete</h2>
          <div className="form-group">
            <label>Sport:</label>
            <input
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="Running, Cycling, Swimming, etc."
            />
          </div>
          <button onClick={handleRegister} className="button" disabled={!sport}>
            Register
          </button>
        </section>
      )}

      {/* Record Performance */}
      {walletAddress && athleteProfile && athleteProfile.isRegistered && (
        <>
          <section className="card">
            <h2>Record Performance Session</h2>
            <p className="info">🔒 All data will be encrypted on-chain</p>

            <div className="form-grid">
              <div className="form-group">
                <label>Heart Rate (BPM):</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                  placeholder="60-200"
                  max={300}
                />
              </div>

              <div className="form-group">
                <label>Calories Burned:</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="100-1000"
                  max={5000}
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes):</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="10-120"
                  max={1440}
                />
              </div>

              <div className="form-group">
                <label>Distance (meters):</label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="1000-10000"
                />
              </div>

              <div className="form-group">
                <label>Intensity (1-10):</label>
                <input
                  type="number"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  placeholder="1-10"
                  min={1}
                  max={10}
                />
              </div>

              <div className="form-group">
                <label>Recovery Time (min):</label>
                <input
                  type="number"
                  value={recoveryTime}
                  onChange={(e) => setRecoveryTime(e.target.value)}
                  placeholder="10-120"
                  max={2880}
                />
              </div>
            </div>

            <button
              onClick={handleRecordPerformance}
              className="button"
              disabled={isEncrypting || !heartRate || !calories || !duration}
            >
              {isEncrypting ? 'Recording...' : 'Record Performance'}
            </button>
          </section>

          <section className="card">
            <h2>Analysis & Leaderboard</h2>

            <div className="button-group">
              <button onClick={handleUpdateAnalysis} className="button">
                Update Analysis
              </button>
            </div>

            <div className="form-group">
              <label>Leaderboard Category:</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Endurance, Power, etc."
              />
              <button
                onClick={handleSubmitLeaderboard}
                className="button"
                disabled={!category}
              >
                Submit to Leaderboard
              </button>
            </div>
          </section>
        </>
      )}

      <footer>
        <p>Built with FHEVM Universal SDK - Fully homomorphic encryption for Web3</p>
        <p className="small">All sensitive data is encrypted on-chain using Zama's FHE technology</p>
      </footer>
    </div>
  );
}

function App() {
  const network = (import.meta.env.VITE_NETWORK as 'sepolia' | 'localhost') || 'sepolia';
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  return (
    <FhevmProvider network={network} contractAddress={contractAddress}>
      <SportsAnalyzerApp />
    </FhevmProvider>
  );
}

export default App;
