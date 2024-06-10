import logo from './logo.svg';
import PaymentForm from './PaymentForm';
import './App.css';

function App() {
  const userId = 1;

  return (
    <div>
      <h1>Buy Coins</h1>
      <PaymentForm userId={userId} />
    </div>
  );
}

export default App;
