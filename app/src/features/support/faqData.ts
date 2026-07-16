export const FAQ_ITEMS: { question: string; answer: string; category: string }[] = [
  {
    category: "Remittance",
    question: "How is the exchange rate and commission calculated?",
    answer:
      "We source live MYR/BDT rates from our treasury FX provider and display them to 4 decimal places. A transparent commission is added based on your send amount tier — you'll always see the exact rate, commission and total before confirming.",
  },
  {
    category: "Remittance",
    question: "How long does payout take?",
    answer: "MFS wallet payouts usually complete within minutes, bank deposits within 1–2 hours, and cash pickup is typically ready within 30 minutes — subject to partner bank cut-off times.",
  },
  {
    category: "Remittance",
    question: "Can I cancel a transfer after sending it?",
    answer: "You can cancel while the transaction is in 'Initiated' or 'Funds Received' status. Once it moves to 'Processing', cancellation must go through customer support and depends on the payout partner's ability to recall the instruction.",
  },
  {
    category: "KYC",
    question: "What documents do I need to register?",
    answer: "You'll need your Bangladeshi NID or passport, a valid Malaysian work permit or employment pass, and a live selfie for liveliness verification.",
  },
  {
    category: "KYC",
    question: "What happens when my work permit expires?",
    answer: "We'll remind you well before expiry. If it lapses without renewal, your transacting capability may be temporarily restricted pending compliance review — simply upload your renewed permit to resume.",
  },
  {
    category: "Bills",
    question: "Which bills can I pay through RemmiNext?",
    answer: "Electricity, gas, water/WASA, internet, and mobile top-up for your family home in Bangladesh. Bill categories are strictly limited to household utilities for your registered Bangladesh address.",
  },
  {
    category: "Bills",
    question: "What happens if an auto-pay bill fails?",
    answer: "You'll be notified immediately with a one-tap option to retry or pay manually. Three consecutive failures automatically pause the auto-pay rule so you can review the biller details.",
  },
  {
    category: "DPS",
    question: "What is a DPS and how is it different from savings?",
    answer: "A Deposit Pension Scheme (DPS) is a fixed-tenure, fixed-instalment savings product from a Bangladeshi partner bank, typically offering a higher indicative return than a regular savings account in exchange for a locked, recurring commitment.",
  },
  {
    category: "DPS",
    question: "Who holds my savings and DPS funds?",
    answer: "RemmiNext never holds your funds directly. All savings and DPS balances are held by licensed Bangladeshi partner banks — RemmiNext is the origination and tracking layer that keeps everything visible in one place.",
  },
];
