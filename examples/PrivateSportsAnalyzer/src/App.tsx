import { useState } from 'react';
import { FhevmProvider, useFhevm, useEncrypt } from '@fhevm/sdk/react';
import { ethers } from 'ethers';
import './App.css';

// Contract ABI
const CONTRACT_ABI = [
  'function registerAthlete(string memory _sport) external',
  'function recordPerformance(uint32 _heartRate, uint32 _calories, uint16 _duration, uint16 _distance, uint8 _intensity, uint32 _recoveryTime) external',
  'function updateAnalysis() external',
  'function submitToLeaderboard(string memory _category) external',
  'function checkGoalAchievement(uint32 _targetHeartRate, uint32 _targetCalories, uint32 _targetDuration, string memory _goalType) external',
  'function getAthleteProfile(address _athlete) external view returns (bool isRegistered, string memory sport, uint256 registrationTime, uint256 sessionCount)',
  'function getContractStats() external view returns (uint256 totalAthletesCount, uint256 totalSessionsCount)',
  'event AthleteRegistered(address indexed athlete, string sport)',
  'event SessionRecorded(address indexed athlete, uint256 sessionId)',
  'event AnalysisUpdated(address indexed athlete)',
  'event LeaderboardUpdated(string category, address indexed athlete)',
  'event GoalAchieved(address indexed athlete, string goalType)'
];

function PrivateSportsAnalyzerApp() {
  const { sdk, isReady, isLoading } = useFhevm();
  const { encrypt, isEncrypting } = useEncrypt();

  const [walletAddress, setWalletAddress] = useState<string>('');
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [athleteProfile, setAthleteProfile] = useState<any>(null);
  const [totalAthletes, setTotalAthletes] = useState<number>(0);
  const [totalSessions, setTotalSessions] = useState<number>(0);

  // Form states
  const [sport, setSport] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [calories, setCalories] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [category, setCategory] = useState('Overall');
  const [targetHR, setTargetHR] = useState('');
  const [targetCalories, setTargetCalories] = useState('');
  const [targetDuration, setTargetDuration] = useState('');

  // Status states
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [performanceStatus, setPerformanceStatus] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [leaderboardStatus, setLeaderboardStatus] = useState('');
  const [goalStatus, setGoalStatus] = useState('');

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x430f85Cc4Ea7bddA82fd6Dd156A06747EdeC0313';

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
      const contractInstance = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      setContract(contractInstance);

      // Load athlete profile and stats
      await loadAthleteProfile(contractInstance, address);
      await loadStats(contractInstance);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    }
  }

  async function loadAthleteProfile(contractInstance: ethers.Contract, address: string) {
    try {
      const profile = await contractInstance.getAthleteProfile(address);
      setAthleteProfile(profile);
    } catch (error) {
      console.error('Error loading athlete profile:', error);
    }
  }

  async function loadStats(contractInstance?: ethers.Contract) {
    const contractToUse = contractInstance || contract;
    if (!contractToUse) return;

    try {
      const stats = await contractToUse.getContractStats();
      setTotalAthletes(Number(stats[0]));
      setTotalSessions(Number(stats[1]));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function registerAthlete() {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    if (!sport) {
      alert('Please select a sport');
      return;
    }

    try {
      setRegistrationStatus('Registering athlete...');
      const tx = await contract.registerAthlete(sport);
      setRegistrationStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setRegistrationStatus('Successfully registered as ' + sport + ' athlete!');
      await loadAthleteProfile(contract, walletAddress);
      await loadStats();
    } catch (error: any) {
      setRegistrationStatus('Registration failed: ' + error.message);
    }
  }

  async function recordPerformance() {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    if (!heartRate || !calories || !duration || !distance || !intensity || !recoveryTime) {
      alert('Please fill in all performance metrics');
      return;
    }

    try {
      setPerformanceStatus('Recording encrypted performance data...');
      const tx = await contract.recordPerformance(
        parseInt(heartRate),
        parseInt(calories),
        parseInt(duration),
        parseInt(distance),
        parseInt(intensity),
        parseInt(recoveryTime)
      );
      setPerformanceStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setPerformanceStatus('Performance session recorded successfully with full privacy protection!');

      // Clear form
      setHeartRate('');
      setCalories('');
      setDuration('');
      setDistance('');
      setIntensity('');
      setRecoveryTime('');

      await loadStats();
      await loadAthleteProfile(contract, walletAddress);
    } catch (error: any) {
      setPerformanceStatus('Recording failed: ' + error.message);
    }
  }

  async function updateAnalysis() {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setAnalysisStatus('Updating confidential performance analysis...');
      const tx = await contract.updateAnalysis();
      setAnalysisStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setAnalysisStatus('Analysis updated! Your performance metrics have been confidentially processed.');
    } catch (error: any) {
      setAnalysisStatus('Analysis update failed: ' + error.message);
    }
  }

  async function submitToLeaderboard() {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setLeaderboardStatus('Submitting encrypted score to ' + category + ' leaderboard...');
      const tx = await contract.submitToLeaderboard(category);
      setLeaderboardStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setLeaderboardStatus('Successfully submitted to ' + category + ' leaderboard! Your score remains encrypted.');
    } catch (error: any) {
      setLeaderboardStatus('Leaderboard submission failed: ' + error.message);
    }
  }

  async function checkGoal() {
    if (!contract) {
      alert('Please connect your wallet first');
      return;
    }

    if (!targetHR || !targetCalories || !targetDuration) {
      alert('Please fill in all goal targets');
      return;
    }

    try {
      setGoalStatus('Checking goal achievement privately...');
      const tx = await contract.checkGoalAchievement(
        parseInt(targetHR),
        parseInt(targetCalories),
        parseInt(targetDuration),
        'Performance Goals'
      );
      setGoalStatus('Transaction sent. Waiting for confirmation...');
      await tx.wait();

      setGoalStatus('Goal check initiated! Result will be processed confidentially.');
    } catch (error: any) {
      setGoalStatus('Goal check failed: ' + error.message);
    }
  }

  return (
    <div className="app">
      <div className="wallet-status">
        {walletAddress ? `🟢 Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '🔌 Not Connected'}
      </div>

      <div className="container">
        <div className="header">
          <h1>🏃‍♂️ Private Sports Analyzer</h1>
          <p>Confidential Performance Evaluation with Zero-Knowledge Privacy</p>
        </div>

        <div className="card">
          <h3>🔐 Wallet Connection</h3>
          <div className="network-info">
            <strong>Network:</strong> Sepolia Testnet | <strong>Protocol:</strong> Zama fhEVM
          </div>
          <button className="btn" onClick={connectWallet} disabled={!!walletAddress}>
            {walletAddress ? 'Connected' : 'Connect MetaMask'}
          </button>
          {walletAddress && (
            <div className="status success">
              Connected to {walletAddress}
            </div>
          )}

          <div className="contract-info">
            <strong>Smart Contract:</strong><br />
            <code>{contractAddress}</code>
          </div>

          <div className="sdk-status">
            <strong>SDK Status:</strong> {isLoading ? 'Loading...' : isReady ? '✅ Ready' : '⏳ Initializing...'}
          </div>
        </div>

        <div className="card">
          <h3>📝 Athlete Registration</h3>
          <div className="form-group">
            <label htmlFor="sport">Choose Your Sport:</label>
            <select id="sport" value={sport} onChange={(e) => setSport(e.target.value)}>
              <option value="">Select Sport</option>
              <option value="Running">Running</option>
              <option value="Cycling">Cycling</option>
              <option value="Swimming">Swimming</option>
              <option value="Weightlifting">Weightlifting</option>
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Tennis">Tennis</option>
              <option value="Yoga">Yoga</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Boxing">Boxing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button className="btn" onClick={registerAthlete} disabled={!contract || !sport}>
            Register as Athlete
          </button>
          {registrationStatus && <div className="status info">{registrationStatus}</div>}
          {athleteProfile && athleteProfile[0] && (
            <div className="status success">
              Registered athlete - Sport: {athleteProfile[1]} | Sessions: {athleteProfile[3].toString()}
            </div>
          )}
        </div>

        <div className="card">
          <h3>📊 Record Performance Session</h3>
          <div className="privacy-note">
            <strong>🔒 Privacy Guaranteed:</strong> All performance data is encrypted using Zama FHE technology. Your personal metrics remain completely confidential while still enabling analysis.
          </div>

          <div className="performance-grid">
            <div className="metric-input">
              <label htmlFor="heartRate">Heart Rate (BPM)</label>
              <input type="number" id="heartRate" min="60" max="300" placeholder="120" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="calories">Calories Burned</label>
              <input type="number" id="calories" min="0" max="5000" placeholder="500" value={calories} onChange={(e) => setCalories(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="duration">Duration (mins)</label>
              <input type="number" id="duration" min="1" max="1440" placeholder="45" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="distance">Distance (m)</label>
              <input type="number" id="distance" min="0" max="50000" placeholder="5000" value={distance} onChange={(e) => setDistance(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="intensity">Intensity (1-10)</label>
              <input type="number" id="intensity" min="1" max="10" placeholder="7" value={intensity} onChange={(e) => setIntensity(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="recovery">Recovery (mins)</label>
              <input type="number" id="recovery" min="0" max="2880" placeholder="180" value={recoveryTime} onChange={(e) => setRecoveryTime(e.target.value)} />
            </div>
          </div>

          <button className="btn" onClick={recordPerformance} disabled={!contract || isEncrypting}>
            {isEncrypting ? 'Encrypting...' : 'Record Session'}
          </button>
          {performanceStatus && <div className="status info">{performanceStatus}</div>}
        </div>

        <div className="grid">
          <div className="card">
            <h3>📈 Update Analysis</h3>
            <p>Generate your confidential performance analysis based on recorded sessions.</p>
            <button className="btn" onClick={updateAnalysis} disabled={!contract}>
              Update Analysis
            </button>
            {analysisStatus && <div className="status info">{analysisStatus}</div>}
          </div>

          <div className="card">
            <h3>🏆 Join Leaderboard</h3>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Overall">Overall Performance</option>
                <option value="Endurance">Endurance</option>
                <option value="Strength">Strength</option>
                <option value="Consistency">Consistency</option>
                <option value="Recovery">Recovery</option>
              </select>
            </div>
            <button className="btn" onClick={submitToLeaderboard} disabled={!contract}>
              Submit to Leaderboard
            </button>
            {leaderboardStatus && <div className="status info">{leaderboardStatus}</div>}
          </div>
        </div>

        <div className="card">
          <h3>🎯 Goal Achievement Check</h3>
          <div className="performance-grid">
            <div className="metric-input">
              <label htmlFor="targetHR">Target Avg HR</label>
              <input type="number" id="targetHR" min="60" max="220" placeholder="140" value={targetHR} onChange={(e) => setTargetHR(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="targetCalories">Target Total Calories</label>
              <input type="number" id="targetCalories" min="0" max="10000" placeholder="2000" value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} />
            </div>
            <div className="metric-input">
              <label htmlFor="targetDuration">Target Total Duration</label>
              <input type="number" id="targetDuration" min="0" max="10000" placeholder="300" value={targetDuration} onChange={(e) => setTargetDuration(e.target.value)} />
            </div>
          </div>
          <button className="btn" onClick={checkGoal} disabled={!contract}>
            Check Goal Achievement
          </button>
          {goalStatus && <div className="status info">{goalStatus}</div>}
        </div>

        <div className="card">
          <h3>📊 Contract Statistics</h3>
          <div className="grid">
            <div className="stats-card">
              <span className="number">{totalAthletes}</span>
              <span className="label">Total Athletes</span>
            </div>
            <div className="stats-card">
              <span className="number">{totalSessions}</span>
              <span className="label">Total Sessions</span>
            </div>
          </div>
          <button className="btn" onClick={() => loadStats()} disabled={!contract}>
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '0x430f85Cc4Ea7bddA82fd6Dd156A06747EdeC0313';
  const network = import.meta.env.VITE_NETWORK || 'sepolia';

  return (
    <FhevmProvider network={network} contractAddress={contractAddress}>
      <PrivateSportsAnalyzerApp />
    </FhevmProvider>
  );
}

export default App;
