import enLocale from 'element-ui/lib/locale/lang/en'

const en = {
  "nav": {
    "wallet": "Wallet",
    "transfer": "Transfer",
    "consensus": "Consensus",
    "contracts": "Contracts",
    "application": "Application",
    "set": "Set",
    "addressList": "Address List",
    "nodeList": "Node List",
    "help": "Help",
  },

  "public": {
    "copySuccess": "Copied to clipboard",
    "operation": "Operation",
    "display": "display",
    "total": "total",
    "hideReward": "Hidden Consensus Award",
    "usableBalance": "Usable balance",
    "fee": "Fee",
    "next": "Next",
    "basicData": "Basic data",
    "time": "Time",
    "amount": "Amount",
    "height": "Height",
    "type": "Type",
    "status": "Status",
    "nodeID": "Node ID",
    "roundInfo": "Round info",
    "rotation": "Rotation",
    "number": "Number",
    "alias": "Alias",
    "createAddress": "Create address",
    "packingAddress": "Packing address",
    "rewardAddress": "Reward address",
    "commission": "Commission",
    "deposit": "Deposit",
    "credit": "Credit",
    "remarks": "Remarks",
    "participants": "Participants",
    "totalStake": "Total stake",
    "method": "Method",
    "results": "Results",
    "success": "Success",
    "fail": "Fail",
    "tokenTransfer": "Token transfer",
    "contractName": "Contract Name",
    "cancelCollection": "Cancel Collection",
    "contractInfo": "Contract Info",
    "input ": "Input",
    "output": "Output",
    "fromAddresss": "Sender",
    "toAddresss": "Recipient",
    "balance": "Balance",
    "allToke": "All Toke",
    "about": "About",
    "logInfo": "Log Info",
    "see": "See",
    "version": "Version",
    "checkUpdates": "Check Updates",
    "operatingSystem": "System",
    "into":"Into",
    "re-import":"Re-import",
    "": "",
    "platform-name":"The Offline Smart Contract Debugging Platform",
    "platform-desc":"The platform is based on NULS 2.0 API Module, which can be used for the release and invocation of intelligent contracts without the need to deploy NULS 2.0 wallet. Before issuing and invoking a smart contract, check that the service node is configured correctly.",

    "err": "Verify and broadcast transaction failure:",
    "err0": "Verify and broadcast transaction exceptions:",
    "err1": "Input and outputs assembly errors:",
    "err2": "Failed to obtain account balance:",
    "err3": "Obtain account balance exceptions:",

    "setsuccess": "Back-end parameter settings were successful",
    "setfail": "Backend parameter settings failed",
  },

  "error": {
    "10000": "Success",
    "10001": "Failed",
    "10002": "Unkown Error",
    "10003": "Data parse error",
    "10004": "Tread name conflict",
    "10005": "Lauguage type not set",
    "10006": "IO error",
    "10007": "Data length error",
    "10008": "Configure error",
    "10009": "Signature error",
    "10010": "Request denied",
    "10011": "The data size is too large, Recommend the single transaction amount is",
    "10012": "Parameter error",
    "10013": "Parameter can not be null",
    "10014": "Data error",
    "10015": "Data not found",
    "10016": "Download version json faild",
    "10017": "Parse JSON faild",
    "10018": "File operation fiald",
    "10019": "Illegal access exception",
    "10020": "Instantiation exception",
    "10035": "It's the latest version",
    "20000": "DB module start error",
    "20001": "DB error",
    "20002": "Dession is not initialized.",
    "20003": "Can not save NULL data",
    "20004": "Batch data error",
    "20005": "Data Error",
    "20006": "Failed to save data",
    "20007": "Failed to update data",
    "20008": "Failed to rollback data",
    "20009": "DB area exists",
    "20010": "DB area not exists",
    "20011": "Create DB area exceed limit",
    "20012": "Create DB area error",
    "20013": "Create DB area path error",
    "20014": "Destroy DB area error",
    "20015": "DB batch operation closed",
    "20023": "Request denied",
    "30001": "Block header sign check failed",
    "30002": "Block header field check failed",
    "30003": "Block field check failed",
    "30004": "The protocol is too big",
    "30005": "Merkle Hash is wrong",
    "ac_0000": "Password is wrong",
    "ac_0001": "Account does not exist",
    "ac_0002": "The account has been encrypted.",
    "ac_0003": "Account already exists",
    "ac_0004": "Address wrong",
    "ac_0005": "Alias already exists.",
    "ac_0006": "Alias is not exist",
    "ac_0007": "The account already set an alias",
    "ac_0008": "The account is not encrypted",
    "ac_0009": "There is another AliasTransaction set the same alias",
    "ac_0010": "Contains encrypted accounts",
    "ac_0011": "Contains unencrypted accounts",
    "ac_0012": "The private key is wrong",
    "ac_0013": "Delete alias error",
    "ac_0014": "The AccountKeystore file does not exist",
    "ac_0015": "The AccountKeystore file was damaged",
    "ac_0016": "The alias format wrong",
    "ac_0017": "The password format wrong",
    "ac_0018": "Decrypt account error",
    "ac_0019": "Account is encrypted and locked",
    "ac_0020": "Remark is too long",
    "ac_0021": "input is too small",
    "ac_0022": "must burn a NULS",
    "ac_0023": "sign count too large",
    "ac_0024": "is not current chain address",
    "ac_0025": "is multi signature address",
    "ac_0026": "is not multi signature address",
    "ac_0027": "asset not exist",
    "ac_0028": "insufficient balance",
    "ac_0029": "insufficient fee",
    "ac_0030": "The chain does not exist",
    "ac_0031": "CoinData data is incomplete",
    "ac_0032": "Transaction is not exist",
    "ac_0033": "Transaction coinData not found",
    "ac_0034": "Transaction data validation error",
    "ac_0035": "Transaction type error",
    "ac_0036": "Invalid transaction or unavailable in current version",
    "ac_0037": "The transaction data is too big",
    "ac_0038": "Transaction payer information does not exist",
    "ac_0039": "Transaction payee information does not exist",
    "ac_0040": "The chain id is error",
    "ac_0041": "The asset id is error",
    "ac_0042": "The signature address of the transaction does not match the coinfrom address",
    "ac_0043": "the address already signed the transaction",
    "ac_0044": "CoinTo has duplicate account assets",
    "ac_0045": "Save alias error",
    "ac_0046": "amount too small",
    "ac_0047": "Black hole addresses prohibit token spending",
    "ac_0048": "Remote response data not found",
    "ac_0049": "Transaction coinFrom underpayment",
    "ac_0050": "There can only be one multi-signature address",
    "ac_0051": "CoinData cannot have contract address",
    "ac_0052":"Please select the account address on the address list page",
    "bl_0001": "Chain switch failed",
    "bl_0002": "The local genesis block differ from network",
    "bl_0003": "Error occur when init local block",
    "bl_0004": "Error occur when saving genesis block",
    "bl_0005": "Update latest height error",
    "bl_0006": "Remove block header error",
    "bl_0007": "Transactions rollback error",
    "bl_0008": "Consensus rollback notice error",
    "bl_0009": "Protocol save notice error",
    "bl_0010": "Consensus save notice error",
    "bl_0011": "Transactions save error",
    "bl_0012": "Save block header error",
    "bl_0013": "Receive out of range block",
    "bl_0014": "Receive duplicate main block",
    "bl_0015": "Receive fork block",
    "bl_0016": "Receive irrelevant block",
    "bl_0017": "Block verify error",
    "cc_0001": "Cross-Chain Transaction payer and payee cannot be the same Chain Account",
    "cc_0002": "No Payment Account for Cross-Chain Transactions",
    "cc_0003": "Cross-Chain Transactions Payment Accounts are not the same Chain Accounts",
    "cc_0004": "Cross-Chain Transaction Receiving Accounts is not the same Chain Account",
    "cc_0005": "Sorry, your credit is running low",
    "cc_0006": "There can only be one payment account for cross-chain transactions with multi-signature accounts.",
    "cc_0007": "Multi-Signed Account Cross-Chain Transaction Payment Account is not Multi-Signed Account",
    "cc_0008": "Multi-Signed Accounts Can't Issue Ordinary Cross-Chain Transactions",
    "cc_0009": "This account is not an encrypted account",
    "cc_0010": "Cross-Chain Transaction Payment Accounts Must Be Local Chain Accounts",
    "cc_0011": "Sorry, your credit is running low",
    "cc_0012": "Payment account and collection account cannot be omitted.",
    "cc_0013": "Interface call failed",
    "cc_0014": "Chain not exist",
    "cc_0015": "CoinData verify error",
    "cc_0016": "Transaction verify error",
    "cc_0017": "TxData verify error",
    "cc_0018": "Transaction commit fail",
    "cc_0019": "Transaction rollback fail",
    "cc_0020": "Not cross-chain transactions in this chain",
    "cc_0021": "Unregistered cross-chain transactions in this chain",
    "cc_0022": "Unregistered cross-chain transactions in target chain",
    "cc_0023": "Assets are registered across the chain",
    "cc_0024": "Cross-chain network unavailability",
    "cm_0001": "Balance not enough",
    "cm_0002": "Param tx error",
    "cm_0003": "Not cross transaction",
    "cm_0004": "Parameter error",
    "cm_1001": "Chain ID already exist",
    "cm_1002": "Chain name  length error",
    "cm_1003": "Chain not found",
    "cm_1004": "Chain address error",
    "cm_1005": "Chain status is incorrect",
    "cm_1006": "Chain Asset is more than 1",
    "cm_1007": "Chain magic number already exist",
    "cm_1008": "Chain name already exist",
    "cm_2000": "Asset Symbol cannot be null",
    "cm_2001": "Asset Symbol length error",
    "cm_2002": "Asset Symbol already exist",
    "cm_2003": "JSON cannot be transfer to Asset object",
    "cm_2004": "The assets recovered must exceed 0.9",
    "cm_2005": "Asset ID already exist",
    "cm_2006": "Asset name cannot be null",
    "cm_2007": "Asset name length error",
    "cm_2008": "The deposit nuls must be 200000",
    "cm_2009": "Asset init number error",
    "cm_2011": "Asset decimal places error",
    "cm_2013": "The chain used to calculate is not a chain for registering the asset",
    "cm_2014": "Asset not exist",
    "cm_2015": "Asset number exceed initialization quantity",
    "cm_2016": "Asset Address Error",
    "cm_2017": "txHash Error",
    "cm_2018": "transaction register rpc call error",
    "cm_2019": "ledger balance rpc call error",
    "cm_3000": "Account validation error",
    "cm_3001": "Account signDigest error.",
    "cs_0001": "data error",
    "cs_0002": "tx not exist",
    "cs_0003": "agent do not exist",
    "cs_0004": "data do not exist",
    "cs_0005": "address is error",
    "cs_0006": "param is error",
    "cs_0007": "The packaging address cannot be the same as the agent address",
    "cs_0008": "The packaging address and reward addresses cannot be the same",
    "cs_0009": "Commission is out of range",
    "cs_0010": "Margin out of range",
    "cs_0011": "Token amount error",
    "cs_0012": "Transaction data validation error",
    "cs_0013": "Agent exist",
    "cs_0014": "Agent packing Address has been used",
    "cs_0015": "Credit ratio too low",
    "cs_0016": "Repeated transaction",
    "cs_0017": "Exceeding the maximum amount that can be entrusted",
    "cs_0018": "Less than the minimum guaranteed amount",
    "cs_0019": "Data Added Failure",
    "cs_0020": "Data rollback failure",
    "cs_0021": "Merkelgen Validation Error",
    "cs_0022": "Block Round data Validation Failed",
    "cs_0023": "Sorry, your credit is running low",
    "cs_0024": "Chains do not exist",
    "cs_0025": "Block red and yellow trades failed to verify",
    "cs_0026": "Block signature error",
    "cs_0027": "Red card transaction verification error",
    "cs_0028": "CoinBase transaction validation error",
    "cs_0029": "Verify that the transaction list is empty",
    "cs_0030": "Remote method call failed",
    "cs_0031": "Account Validation Error",
    "cs_0032": "Transaction Signature Verification Error",
    "cs_0033": "CoinData valid error",
    "cs_0034": "The entrusted transaction has withdrawn from the entrustment",
    "cs_0035": "The rollback withdrawal delegation transaction was not submitted",
    "cs_0036": "Try fork",
    "cs_0037": "Double speed",
    "cs_0038": "Get too many yellow cards",
    "cs_0039": "Conflict detection error",
    "lg_0001": "Parameter error.tx is invalid.",
    "lg_0002": "Chain init Exception.",
    "lg_1001": "ORPHAN.",
    "lg_1002": "DOUBLE EXPENSES.",
    "lg_1003": "TX EXIST",
    "lg_1004": "BALANCE NOT ENOUGH",
    "lg_1010": "FAIL",
    "nw_0001": "Net message error",
    "nw_0002": "Net message send fail",
    "nw_0003": "Net message send exception",
    "nw_0004": "Net message broadcast error",
    "nw_0005": "Peer node disconnect",
    "nw_0006": "Peer node miss channel exception",
    "sc_0001": "Contract execute error",
    "sc_0002": "Contract address does not exist",
    "sc_0003": "Create contract tx error",
    "sc_0004": "Illegal contract address",
    "sc_0005": "Non-contractual transaction",
    "sc_0006": "Funds for non-contractual transaction cannot be transferred to the contract address",
    "sc_0007": "The format of the name is incorrect.",
    "sc_0008": "Non-NRC20 contract",
    "sc_0009": "Non-view method",
    "sc_0010": "Illegal contract code",
    "sc_0011": "Duplicate token name",
    "sc_0012": "The format of the symbol is incorrect.",
    "sc_0013": "Contract Locked",
    "sc_0014": "The value of decimals ranges from 0 to 18",
    "sc_0015": "The value of totalSupply ranges from 1 to 2^256 - 1",
    "sc_0016": "The minimum value of price is 25",
    "sc_0017": "Cannot delete contract when balance is not 0",
    "sc_0018": "The contract deleter must be the contract creator",
    "sc_0019": "The contract has been deleted",
    "sc_0020": "Exceeded the maximum GAS limit for contract calls",
    "sc_0021": "Do not execute view methods",
    "sc_0022": "This contract does not accept direct transfers",
    "sc_0023": "Contract method does not exist",
    "sc_0024": "Transfer amount cannot be locked.",
    "sc_0025": "Insufficient balance to transfer to the contract address.",
    "sc_0026": "The contract creator is not the transaction creator.",
    "sc_0027": "The contract caller is not the transaction creator.",
    "sc_0028": "The contract deleter is not the transaction creator.",
    "sc_0029": "The contract deleter is not the contract creator.",
    "sc_0030": "That balance of the contract is abnormal.",
    "sc_0031": "The receiver is not the contract address.",
    "sc_0032": "Insufficient token balance",
    "sc_0033": "Different modules registered duplicate cmd",
    "sc_0034": "The type of NEW_TX does not support non-string array return values",
    "sc_0035": "Illegal operation, cannot transfer token, cannot send events, cannot transfer internally, cannot call contracts internally, cannot generate new transactions",
    "sc_0036": "The value of gas limit ranges from 1 to 10,000,000",
    "sc_0037": "The chain id or assets id of coin is error.",
    "sc_0038": "The contract coin to is not empty.",
    "sc_0039": "The contract alias format error.",
    "sc_0100": "Insufficient balance",
    "sc_0101": "Transaction fee is not right",
    "sc_0102": "The amount of the transfer is too small",
    "sc_0103": "Transaction is not exist",
    "sc_0104": "Password is wrong",
    "sc_0105": "Account does not exist",
    "sc_0106": "Address wrong",
    "sc_9999": "Contract unknown error",
    "tx_0001": "Transactions hash error",
    "tx_0002": "The coin-from address does not match the chain",
    "tx_0003": "The coin-to address does not match the chain",
    "tx_0004": "Insufficient fee",
    "tx_0005": "The asset id is error",
    "tx_0006": "CoinFrom not exist",
    "tx_0007": "CoinTo not exist",
    "tx_0008": "CoinFrom has duplicate account assets",
    "tx_0009": "CoinTo has duplicate account assets",
    "tx_0010": "CoinFroms not the same chain",
    "tx_0011": "CoinTo not the same chain",
    "tx_0012": "Transaction coinData not found",
    "tx_0013": "Transaction already exists",
    "tx_0014": "Transaction does not exist",
    "tx_0015": "Deserialize transaction error",
    "tx_0016": "Deserialize coinData error",
    "tx_0017": "The signature address of the transaction does not match the coinfrom address",
    "tx_0018": "The block height update cannot be repackaged for the rest of the time",
    "tx_0019": "Package get transactions time out",
    "tx_0020": "The chain is not found",
    "tx_0021": "Invalid(unregistered) transaction or unavailable in current version",
    "tx_0022": "Transaction data validation error",
    "tx_0023": "The transaction data is too big",
    "tx_0024": "Account is not exist",
    "tx_0025": "Transaction ledger verify fail",
    "tx_0026": "Orphan transaction",
    "tx_0027": "Repeated transaction",
    "tx_0028": "Remote response data not found",
    "tx_0029": "Transaction from cannot have contract address",
    "tx_0030": "Temporarily stop processing new transactions",
  },

  "tab": {
    "tab0": "Assets",
    "tab1": "Type",
    "tab2": "Total",
    "tab3": "Locking",
    "tab4": "Available",
    "tab5": "Time",
    "tab6": "Amount",
    "tab7": "Thaw height/time",
    "tab8": "Cause freezing",
    "tab9": "Balance",
    "tab10": "State",
  },

  "type": {
    "undefined": "",
    "0": "All",
    "1": "Consensus reward",
    "2": "Transfer",
    "3": "Aliased",
    "4": "Register node",
    "5": "Stake",
    "6": "Cancel consensus",
    "7": "Yellow card",
    "8": "Red card",
    "9": "Unregister node",
    "10": "Cross Trading",
    "11": "Cross Register",
    "15": "Contract creation",
    "16": "Call contract",
    "17": "Delete contract",
    "18": "Contract transfer",
    "19": "Contract return",
  },

  "budgetType": {
    "undefined": "",
    "0": "Income/Pay",
    "1": "Income",
    "2": "Pay",
  },

  "frozenType": {
    "undefined": "",
    "1": "Highly locking",
    "2": "Time locking",
    "3": "Consensus locking",
    "4": "Create Nodes",
    "5": "Stake",
    "8": "Red card",
    "9": "Unregister node",
    "11": "Registration Cross-Chain",
  },

  "addressType": {
    "undefined": "",
    "1": "General Account",
    "2": "Contract account",
    "3": "Multi account"
  },

  "transferStatus": {
    "undefined": "",
    "0": "Unconfirmed",
    "1": "Confirmed"
  },

  "nodeType": {
    "undefined": "",
    "0": "General",
    "1": "Credit",
    "2": "Commission",
    "3": "Staked amount",
    "4": "Deposit"
  },

  "assetsType": {
    "undefined": "",
    "0": "All Asset",
    "1": "Ordinary Asset",
    "2": "Reference Asset",
  },

  "history": {
    "0": "All history",
    "1": "Int history",
    "2": "Out history",
  },

  "nodeStatus": {
    "undefined": "",
    "0": "All nodes",
    "1": "General nodes",
    "2": "Developer nodes",
    "3": "Ambassador nodes"
  },

  "lockType": {
    "undefined": "",
    "4": "Create Node Lock",
    "5": "Join consensus lock-in",
    "8": "Red card penalty lock-in",
    "9": "Logout Node Locking",
    "11": "Registration Cross-Chain",
  },

  "contractStatus": {
    "undefined": "",
    "-1": "Execution failed",
    "0": "Normal",
    "1": "Normal",
    "2": "Normal",
    "3": "Termination"
  },

  "contractType": {
    "undefined": "",
    "0": "Non-Token",
    "1": "NRC20",
    "2": "NRC721"
  },

  "password": {
    "password0": "Pass word",
    "password1": "Please input a password",
    "password2": "Cancel",
    "password3": "Confirm",
  },

  "home": {
    "home0": "Main assets",
    "home1": "Cross assets",
    "home2": "Transaction record",
  },

  "frozenList": {
    "frozenList0": "Frozen list",
  },

  "transfer": {
    "transfer0": "Payment address:",
    "transfer1": "Receipt address:",
    "transfer2": "Asset type:",
    "transfer3": "Transfer amount:",
    "transfer4": "Remarks:",
    "transfer5": "The handling fee value is estimated based on the current NULS network, the actual consumption may be less than that value, and the surplus will be returned by consensus reward.",
    "transfer6": "Transfer confirmation",
    "transfer7": "Cancel",
    "transfer8": "Confirm submission",
    "transfer9": "Please enter the receipt address.",
    "transfer10": "Please enter the correct collection address.",
    "transfer11": "Please enter the amount",
    "transfer12": "The amount must be a number.",
    "transfer13": "The amount must be greater than 0.001",
    "transfer14": "The amount should not be greater than the available balance.",
    "transfer15": "Tip: The address you fill in is a cross-chain address. This transaction will be a cross-chain transaction. You can only choose basic assets.",
    "transfer16": "The NULS of payment address is insufficient. Please switch accounts.",
    "transfer17": "Cross-Chain Transaction Chain is insufficient, please switch accounts",
    "transfer": "transfer",
  },

  "consensus": {
    "consensus0": "My consensus",
    "consensus1": "Total entrust",
    "consensus2": "Available balance",
    "consensus3": "Total Consensus Award",
    "consensus4": "All consensus",
    "consensus5": "New node",
    "consensus6": "Consensus node",
    "consensus7": "Total node",
    "consensus8": "Total delegation",
    "consensus9": "All nodes",
    "consensus10": "Please choose to enter ID\\alias\\address...",
    "consensus11": "My node",
  },

  "newConsensus": {
    "newConsensus0": "Create node",
    "newConsensus1": "Create node validation",
    "newConsensus2": "Please enter the reward address.",
    "newConsensus3": "Please enter the block address",
    "newConsensus4": "Packing Address cannot create Address",
    "newConsensus5": "Please enter a deposit",
    "newConsensus6": "Margin must be numbered",
    "newConsensus7": "Sorry, the balance is insufficient.",
    "newConsensus8": "Margin not less than 2000 and not more than 500000",
    "newConsensus9": "Please enter the Commission ratio.",
    "newConsensus10": "The commission ratio must be numeric",
    "newConsensus11": "Margin not less than 10 and not more than 100",
  },

  "consensusList": {
    "consensusList0": "Consensus details",
    "consensusList1": "Adding time",
  },

  "consensusInfo": {
    "consensusInfo0": "Withdraw",
    "consensusInfo1": "Amount entrusted",
    "consensusInfo2": "The amount entrusted cannot be empty",
    "consensusInfo3": "Please enter a valid amount of commission",
    "consensusInfo4": "The amount of commission is not less than 2000 and the total amount of commission is less than 500000.",
    "consensusInfo5": "Logoff node",
    "consensusInfo6": "Node information",
    "consensusInfo7": "Total reward",
    "consensusInfo8": "Creator alias",
    "consensusInfo9": "Creation time",
    "consensusInfo10": "Node penalty",
    "consensusInfo11": "Yellow card",
    "consensusInfo12": "The creator of a node needs to collect a certain percentage of consensus block reward, namely commission, from the client of the node. For example, if the total consensus reward of a client is 10 NULS and the commission ratio is set to 10%, the founder charges 10*10%=1 NULS commission, and the client actually receives the NULS consensus reward.",
  },

  "nodeService": {
    "nodeService0": "Node switching...",
    "nodeService1": "Node Service List",
    "nodeService2": "Name",
    "nodeService3": "Service address",
    "nodeService4": "Delay",
    "nodeService5": "State",
    "nodeService6": "Operation",
    "nodeService7": "Alter",
    "nodeService8": "Remove",
    "nodeService9": "Add Node Service Address",
    "nodeService10": "The unofficial address you entered may not work properly, so the loss will be borne by you.",
    "nodeService11": "Test connection",
    "nodeService12": "Immediate use",
    "nodeService13": "Name cannot be empty",
    "nodeService14": "Address cannot be empty",
    "nodeService15": "Please enter the correct connection address",
    "nodeService151": "Service address already exists, please change service address!",
    "nodeService16": "Nodes cannot be connected",
    "nodeService17": "Connection failed",
    "nodeService18": "Request timeout",
    "nodeService19": "This operation will be removed",
    "nodeService20": "Does Node Service Continue",
    "nodeService21": "Tips",
    "nodeService22": "Remove success",
    "official": "Official",
    "nodeService23": "Chain name",
  },

  "address": {
    "address0": "Address management",
    "address1": "Account",
    "address2": "Balance",
    "address3": "Alias",
    "address4": "Remarks",
    "address5": "Operation",
    "address6": "Change Password",
    "address7": "Backups",
    "address8": "Remove",
    "address9": "Please enter notes",
    "address10": "Cancel",
    "address11": "Confirm",
    "address12": "Sorry, the account balance is insufficient.",
    "address13": "Password error",
    "address14": "Failed to get address list",
    "address15": "Failed to remove address:",
    "address": "",
  },

  "newAddress": {
    "newAddress0": "Create Account",
    "newAddress1": "Backup account",
    "newAddress2": "Set password",
    "newAddress3": "Backups",
    "newAddress4": "This account is used to test the deployment and invocation of the smart contracts, allowing no password to be set.",
    "newAddress5": "Please keep your wallet password carefully. NULS wallet does not store your password and can't help you find it. Please keep it in mind.",
    "newAddress6": "Password",
    "newAddress7": "Confirm password",
    "newAddress8": "Click Next and you've agreed.",
    "newAddress9": "user agreement",
    "newAddress10": "Next",
    "newAddress11": "Import private key",
    "newAddress12": "Your account address",
    "newAddress13": "Don't lose it! NULS will not be able to help you retrieve the missing key",
    "newAddress14": "Don't share with others! If you use this file on malicious websites, your funds may be at risk of theft.",
    "newAddress15": "Please make a backup! In case your computer breaks down",
    "newAddress16": "Keystore backup",
    "newAddress17": "Key backup",
    "newAddress18": "Entering Wallet",
    "newAddress19": "Warning",
    "newAddress20": "Private keys are not encrypted and backup is risky. Please save them to a safe place. Keystore is recommended for backup.",
    "newAddress21": "Copy",
    "newAddress22": "Please input a password",
    "newAddress23": "Please enter an 8-20-bit password composed of letters and numbers",
    "newAddress24": "Please enter your password again.",
    "newAddress25": "Two inconsistencies in password input",
    "newAddress26": "Keystore save failed, please restart and try again ",
    "newAddress27": "File save completed, location:",
    "newAddress28": "Select the location where the keystore file is saved",
    "newAddress29": "Please choose a password-aware prompt",
    "newAddress30": "Account creation failed:",
    "newAddress31": "Export private key failed:",
    "newAddress": "",
  },

  "editPassword": {
    "editPassword0": "Change Password",
    "editPassword1": "Old password",
    "editPassword2": "New password",
    "editPassword3": "Confirm the new password",
    "editPassword4": "Submission",
    "editPassword5": "If you forget your password, you can re-import it with your private key",
    "editPassword6": "Please enter your password again",
    "editPassword7": "Please enter an 8-20-bit password composed of letters and numbers",
    "editPassword8": "Please enter a new password",
    "editPassword9": "The new password cannot be the same as the old one",
    "editPassword10": "Please enter the new password again.",
    "editPassword11": "The new password is different from the confirmation of the new password. Please re-enter it.",
    "editPassword12": "Password modification completed",
    "editPassword13": "Old password error",
  },

  "importAddress": {
    "importAddress0": "Create address",
    "importAddress1": "Import private key",
    "importAddress2": "Keystore import",
    "importAddress3": "Key import",
    "importAddress4": "Select the keystore file",
    "importAddress5": "Please enter your private key:",
    "importAddress6": "Password",
    "importAddress7": "Confirm password",
    "importAddress8": "Import private key",
    "importAddress9": "Private key cannot be empty",
    "importAddress10": "Please input a password",
    "importAddress11": "Please enter an 8-20-bit password composed of letters and numbers",
    "importAddress12": "Please enter your password again.",
    "importAddress13": "Two inconsistencies in password input",
    "importAddress14": "Select the imported keystore file",
    "importAddress15": "Keystore import failed, please restart and try again ",
    "importAddress16": "Please select the correct keystore file",
    "importAddress17": "Please select a keystore file to import",
    "importAddress18": "Import private key fail:",
  },

  "setAlias": {
    "setAlias0": "Setting aliases",
    "setAlias1": "Aliases can be used as payees of ",
    "setAlias11": " transfers. For account security, after the alias setting is determined, it will not be able to be modified. Please operate with caution.",
    "setAlias2": "Setting aliases costs 1 ",
    "setAlias3": "Total cost",
    "setAlias4": "Please enter an alias",
    "setAlias5": "Please enter an alias (only lowercase letters, numbers, underscores are allowed (underscores cannot be at both ends)",
  },

  "contract": {
    "contract1": "My contract",
    "contract2": "Contract address",
    "contract3": "Label",
    "contract4": "Call",
    "contract5": "Find contract",
    "contract6": "Please enter the contract address.",
    "contract7": "Search",
    "contract8": "All contracts",
    "contract9": "Contracts",
    "contract10": "Deployment contract",
    "contract11": "Failed to get contract list:",
    "contract12": "Get contract list exception:",
    "contract13": "Search contract failed:",
    "contract14": "Search for contract exceptions:",
    "contract15": "Please enter the correct contract address",
    "contract16":"Contract type",
    "contract": "",
  },

  "call": {
    "call1": "Please choose a method",
    "call2": "can not be empty",
    "call3": "Advanced options",
    "call4": "Gas Error Predicting Call Contract Transaction",
    "call5": "Predicting gas anomalies in invoking contract transactions",
    "call6": "Verify the invocation contract transaction error",
    "call7": "Verify call contract transaction exception",
    "call8": "Unchained method call failed",
    "call9": "Unchained method call exception",
    "call10": "Gas too small may cause contract transactions to fail",
    "call11":"Contract invocation is successful, transaction data HASH: ",
    "call12":"Contract call failed, error message: ",
    "call": "",
  },

  "deploy": {
    "deploy1": "HEX Code",
    "deploy2": "Jar Package",
    "deploy3": "Upload jar package",
    "deploy4": "File name",
    "deploy5": "Test",
    "deploy6": "Deploy",
    "deploy7": "Enter the hex code",
    "deploy8": "Please input gas",
    "deploy81": "Gag Limit range;1~10000000",
    "deploy9": "Please input price",
    "deploy91": "Price must be greater than 1",
    "deploy10": "Getting constructor errors",
    "deploy11": "Verify the creation contract transaction error",
    "deploy12": "Verify Creating Contract Transaction Exceptions",
    "deploy13": "Gas Error in Estimating the Creation of Contract Transactions",
    "deploy14": "Estimating Gas Exceptions for Creating Contract Transactions",
    "deploy15": "Assemble txData errors that create contract transactions",
    "deploy16": "Test pass",
    "deploy17": "Error uploading jar package",
    "deploy18": "Upload jar package exception",
    "deploy19": "Please enter the contract name.",
    "deploy20": "Contract name (only lowercase letters, numbers, underscores are allowed (underscores cannot be at both ends)",
    "deploy21": "Contract Name",
    "deploy22":"Start deploy contract",
    "deploy23":"The current contract code has been read automatically. If you need to deploy another contract, please upload it by yourself.",
    "deploy24":"Contract deployment is successful, contract address:",
    "deploy25":"Contract deployment failed, error message:",
    "deploy": "deploy",
  },

  "codeInfo": {
    "codeInfo0": "Contract source code is certified",
    "codeInfo1": "Compiler",
    "codeInfo2": "The certification date",
    "codeInfo3": "Contract code",
    "codeInfo4": "Contract source code isn't certified",
    "codeInfo5": "Sorry, source code certificate failed!",
    "codeInfo6": "Upload source code for certification",
    "codeInfo7": "Source code upload notes",
    "codeInfo8": "1.Please compress the source code into a zip package for uploading",
    "codeInfo9": "2.The file directory structure and code in the zip package need to be consistent with deployment code, or it will result in certificating failure",
    "codeInfo10": "Sorry, the maximum upload file size is 5M",
    "codeInfo11": "Request timeout please retry",
    "codeInfo12": "Sorry, I didn't find anything",
    "codeInfo13": "3.Zip packages should not contain non-Java files, otherwise upload authentication will fail",
  },

  "contractInfo": {
    "contractInfo1": "Cancel Contract",
    "contractInfo2": "Number Trades",
    "contractInfo3": "Creator",
    "contractInfo4": "Token",
    "contractInfo5": "Transaction Type",
    "contractInfo6": "Contract method",
    "contractInfo7": "Parameter",
    "contractInfo8": "Return type",
    "contractInfo9": "Failure to obtain contract details:",
    "contractInfo10": "Unusual contract details:",
    "contractInfo11": "Failed to obtain contract transaction list:",
    "contractInfo12": "Get contract transaction list exception:",
    "contractInfo13": "Failed to verify deletion contract:",
    "contractInfo14": "contractInfo",
  },

  "bottom": {
    "serviceNode": "Service node",
    "nodeHeight": "Host/Service Node",
    "agreement": "Service agreement",
    "policy": "Privacy policy",
    "updateWallet": "Update wallet",
    "Tips": "Tips",
    "Backstage": "Background operation",
  },

  "TipsType": {
    "undefined": "",
    "1": "Check for update errors",
    "2": "Checking for updates...",
    "3": "A new version has been detected and is being downloaded...",
    "4": "Now the latest version is in use, no updates are needed.",
  },
  ...enLocale

};
export default en
