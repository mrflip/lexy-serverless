export const datestamp = (new Date()).toJSON().slice(0,10)
export const env_stage = process.env.stage
export const Paths = {
  datestamp,
  //
  bee_line_file:        `./data/all_bees_line-${datestamp}-${env_stage}.jsonl`,
  bee_bkup_file:        `./data/all_bees_bkup-${datestamp}-${env_stage}.json`,
}


export default Paths
