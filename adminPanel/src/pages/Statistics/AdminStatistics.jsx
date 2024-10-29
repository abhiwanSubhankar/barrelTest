import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styles from "./Statistics.module.css";
import { base_url } from "../../baseUrl/baseUrl";
import { toast } from "react-hot-toast";

const AdminStatistics = () => {
  const [selectedRange, setSelectedRange] = useState(100);
  const [data, setData] = useState({
    weightedRTP: 0.00,
    avgScore: 0.00,
    totalPayOut: 0.00,
    totalReceived: 0.00,
    standardDeviation: 0.00,
    avgCashPotMultiPlayerValue: 0.00,
    payOutByHitingCashPotPercentage: 0.00
  });
  const token = JSON.parse(sessionStorage.getItem("token"));


  const getStatistics = useCallback(async () => {

    let toastId = toast.loading("Getting data...");

    axios.post(
      `${base_url}/statistics`,
      {
        range: selectedRange
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }).then((data) => {

        let response = data.data.data;
        console.log("resonse", data.data.data);
        setData(response)
        toast.success("Successful.", { id: toastId });

      }).catch((err) => {
        console.log("delete error", err);
        toast.error("Unsuccessful.", { id: toastId });
      })

  }, [selectedRange, token]);



  useEffect(() => {

    getStatistics();
    console.log(selectedRange);


  }, [getStatistics, selectedRange]);

  return (
    <div className={styles.container}>
      <div className={styles.selectWrapper} >
        <span>Selected Range of Data</span>
        <select
          name="rangeSelect"
          id="rangeSelect"
          className={styles.select}
          value={selectedRange}
          onChange={(e) => {
            setSelectedRange(e.target.value)
          }}
        >
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
          <option value="1000">1000</option>
        </select>
      </div>


      <div className={styles.mainContent}>
        <div className={styles.data}>
          <img src="/average.png" alt="data icon" className={styles.dataIcon} />
          <h2>weighted RTP plays </h2>
          <h3>  {data?.weightedRTP}</h3>
        </div>

        <div className={styles.data}>
          <img src="/payout.png" alt="data icon" className={styles.dataIcon} />
          <h2>Total PayOut for latest {selectedRange} plays </h2>
          <h3> $ {data?.totalPayOut}</h3>
        </div>

        <div className={styles.data}>
          <img src="/income.png" alt="data icon" className={styles.dataIcon} />
          <h2>Total Received for latest {selectedRange} plays </h2>
          <h3> $ {data?.totalReceived}</h3>
        </div>

        <div className={styles.data}>
          <img src="/payout.png" alt="data icon" className={styles.dataIcon} />
          <h2>Average CashPot MultiPlayer Value </h2>
          <h3> $ {data?.avgCashPotMultiPlayerValue}</h3>
        </div>

        <div className={styles.data}>
          <img src="/average.png" alt="data icon" className={styles.dataIcon} />
          <h2>  Standard deviation for last {selectedRange} plays </h2>
          <h3>  {data?.standardDeviation}</h3>
        </div>

        <div className={styles.data}>
          <img src="/payout.png" alt="data icon" className={styles.dataIcon} />
          <h2>Percentage of PayOut by hitting cashpot</h2>
          <h3>:- {data?.payOutByHitingCashPotPercentage.toFixed(2)} %</h3>
        </div>

      </div>
    </div>
  );
};

export default AdminStatistics;
