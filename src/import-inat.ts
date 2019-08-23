import configure from './config'
import { RequestParams } from '@elastic/elasticsearch'
import axios, { AxiosResponse } from 'axios'

namespace iNat {
  export namespace Observation {
    export type Response = {
      total_result: number
      page: number
      per_page: number
      results: {
        uuid: string
        quality_grade: 'needs_id'
        time_observed_at: string
        license_code: 'cc-by-nc'
        taxon: any
        location: string
      }[]
    }
  }
}

const wait = (msec: number) => new Promise(resolve => setTimeout(resolve, msec))

// iNaturalist importer for Elasticsearch
const main = async () => {
  const { client } = await configure()

  for (let year = 2016; year < 2019; year++) {
    for (let month = 1; month < 13; month++) {
      for (let day = 5; day < 28; day++) {
        for (let i = 1; i < 11; i++) {
          console.log(`waiting inat (${year}/${month}/${day} - ${i})`)
          const {
            data: observations
          }: AxiosResponse<iNat.Observation.Response> = await axios.get(
            `https://api.inaturalist.org/v1/observations?per_page=200&page=${i}&year=${year}&month=${month}&day=${day}`
          )

          const exgeojsons = observations.results
            .filter(x => !!x.location)
            .map(observation => {
              const [lat, lon] = observation.location.split(',')
              return {
                id: observation.uuid,
                type: 'Feature',
                properties: {
                  quality_grade: observation.quality_grade,
                  time_observed_at: observation.time_observed_at,
                  license_code: observation.license_code,
                  taxon: observation.taxon
                },
                geometry: {
                  coordinates: { lon, lat } // transformed from original geojson format
                }
              }
            })
          const doc: RequestParams.Bulk = {
            index: 'inat',
            body: exgeojsons.map(x => `{"index":{}}\n${JSON.stringify(x)}\n`)
          }

          console.log(`waiting elasticsearch (${year}/${month}/${day} - ${i})`)
          try {
            const result = await Promise.all([client.bulk(doc), wait(5000)])
            console.log(
              'errors',
              result[0].body.items.map(x => x.index.error).filter(x => !!x)
            )
          } catch (e) {
            console.log(e.meta)
            // console.error(JSON.stringify(e, null, 2))
          }
        }
      }
    }
  }
}

main()
