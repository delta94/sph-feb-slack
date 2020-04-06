import React from 'react';
import { Progress } from 'semantic-ui-react';
import '../App.css';

const ProgressBar = ({ uploadState, percentUpload}) => (
  (uploadState && percentUpload !== 100)  && (
    <Progress
      className="progress__bar"
      percent={percentUpload}
      size="medium"
      progress
      indicating
      inverted
    />
  )  
);

export default ProgressBar;