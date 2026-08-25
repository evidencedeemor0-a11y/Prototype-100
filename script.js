const transactions = [
    {name:"Amazon", time:"10:32 AM", amt:-54.21, color:"#111", ic:"A"},
    {name:"Starbucks", time:"8:47 AM", amt:-6.53, color:"#0f7a3a", ic:"S"},
    {name:"Payroll Deposit", time:"9:15 AM", amt:1650.00, color:"#189256", ic:"↓", isDeposit:true},
    {name:"Uber", time:"6:23 PM", amt:-18.32, color:"#000", ic:"U"},
  ];
  const txToday = [
    {name:"Amazon", time:"10:32 AM", amt:-54.21, color:"#111", ic:"a"},
    {name:"Starbucks", time:"8:47 AM", amt:-6.53, color:"#0f7a3a", ic:"S"},
  ];
  const txYesterday = [
    {name:"Payroll Deposit", time:"9:15 AM", amt:1650.00, color:"#189256", ic:"↓"},
    {name:"Uber", time:"6:23 PM", amt:-18.32, color:"#000", ic:"U"},
    {name:"Target", time:"2:31 PM", amt:-41.78, color:"#cc0000", ic:"◎"},
  ];
  const txOlder = [
    {name:"Netflix", time:"9:41 PM", amt:-15.49, color:"#cc0000", ic:"N"},
  ];

  function txRow(t){
    const amtClass = t.amt > 0 ? 'pos' : 'neg';
    const amtStr = (t.amt > 0 ? '+' : '-') + '$' + Math.abs(t.amt).toFixed(2);
    return `<div class="txrow">
      <div class="txicon" style="background:${t.color};">${t.ic}</div>
      <div class="mid"><div class="n">${t.name}</div><div class="d">${t.time}</div></div>
      <div class="amt ${amtClass}">${amtStr}</div>
    </div>`;
  }

  document.getElementById('home-tx-list').innerHTML = transactions.map(txRow).join('');
  document.getElementById('tx-today').innerHTML = txToday.map(txRow).join('');
  document.getElementById('tx-yesterday').innerHTML = txYesterday.map(txRow).join('');
  document.getElementById('tx-older').innerHTML = txOlder.map(txRow).join('');

  // Maps a screen name to the bottom-nav tab (if any) that should light up for it
  const tabForScreen = { home:'home', transactions:'activity', cashMap:'cashMap' };

  function go(name){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('screen-' + name);
    target.classList.add('active');
    target.scrollTop = 0;

    // screens marked no-nav (pending / success) hide the bottom nav entirely
    const navbar = document.querySelector('.navbar');
    navbar.style.display = target.classList.contains('no-nav') ? 'none' : '';

    document.querySelectorAll('.navbtn').forEach(b => b.classList.remove('active'));
    const tab = tabForScreen[name];
    if(tab){
      const btn = document.querySelector(`.navbtn[data-tab="${tab}"]`);
      if(btn) btn.classList.add('active');
    }
  }
  go('home');

  function setSeg(el){
    document.querySelectorAll('.segbtn').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
  }

  // Map pins
  const pinsData = [
    {x:14,y:20},{x:52,y:14},{x:78,y:17},{x:8,y:44},{x:38,y:40},{x:66,y:44},{x:92,y:52},
    {x:26,y:64},{x:56,y:70},{x:84,y:84}
  ];
  const mapbox = document.getElementById('mapbox');
  pinsData.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'pin';
    div.style.left = p.x + '%';
    div.style.top = p.y + '%';
    div.innerHTML = `<svg viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#189256"/>
      <circle cx="12" cy="12" r="5" fill="#fff"/>
    </svg>`;
    mapbox.appendChild(div);
  });

  // ===================== SEND MONEY ===================== //

  function fmtAmt(n){
    return '$' + (isNaN(n) ? 0 : n).toFixed(2);
  }

  function setAmount(n){
    document.getElementById('sendAmountInput').value = n;
    updateSummary();
  }

  function updateSummary(){
    const val = parseFloat(document.getElementById('sendAmountInput').value) || 0;
    const str = fmtAmt(val);
    document.getElementById('sumSending').textContent = str;
    document.getElementById('sumPay').textContent = str;
    document.getElementById('sumReceives').textContent = str;
  }

  // ===================== PIN MODAL ===================== //

  const CORRECT_PIN = '1472';
  let pendingSendAmount = 0;

  function resetPinBoxes(){
    const hiddenInput = document.getElementById('pinHiddenInput');
    hiddenInput.value = '';
    for(let i = 0; i < 4; i++){
      const box = document.getElementById('pb' + i);
      box.textContent = '';
      box.classList.remove('filled','error');
    }
    document.getElementById('pinError').textContent = '';
  }

  function openPinModal(){
    const amt = parseFloat(document.getElementById('sendAmountInput').value) || 0;
    if(amt <= 0){
      alert('Please enter an amount to send.');
      return;
    }
    pendingSendAmount = amt;
    resetPinBoxes();
    document.getElementById('pinOverlay').classList.add('open');
    setTimeout(() => document.getElementById('pinHiddenInput').focus(), 300);
  }

  function closePinModal(){
    document.getElementById('pinOverlay').classList.remove('open');
    document.getElementById('pinHiddenInput').blur();
    resetPinBoxes();
  }

  document.getElementById('pinHiddenInput').addEventListener('input', function(){
    const val = this.value.replace(/[^0-9]/g,'').slice(0,4);
    this.value = val;

    for(let i = 0; i < 4; i++){
      const box = document.getElementById('pb' + i);
      const digit = val[i];
      box.textContent = digit || '';
      box.classList.toggle('filled', !!digit);
      box.classList.remove('error');
    }

    if(val.length === 4){
      if(val === CORRECT_PIN){
        this.blur();
        document.getElementById('pinOverlay').classList.remove('open');
        startTransaction(pendingSendAmount);
      } else {
        document.getElementById('pinError').textContent = 'Incorrect PIN. Try again.';
        document.querySelectorAll('.pin-box').forEach(b => b.classList.add('error'));
        setTimeout(() => {
          resetPinBoxes();
          this.focus();
        }, 550);
      }
    }
  });

  // ===================== PENDING → SUCCESS ===================== //

  function startTransaction(amount){
    const amtStr = fmtAmt(amount);
    document.getElementById('pendAmount').textContent = amtStr;
    document.getElementById('succAmount').textContent = amtStr;
    go('pending');
    setTimeout(() => go('success'), 10000);
  }
