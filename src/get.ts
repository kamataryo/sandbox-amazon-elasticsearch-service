import configure from './config'
import { RequestParams } from '@elastic/elasticsearch'

export const getDocs = async () => {
  const { client } = await configure()

  const doc: RequestParams.Search = {
    index: 'inat',
    body: {
      query: {
        bool: {
          must: {
            // match_all: {}
            match: {
              'properties.quality_grade': 'casual'
            }
          },
          filter: {
            geo_distance: {
              distance: '1000km',
              'geometry.coordinates': {
                lon: 136.146937,
                lat: 35.445541
              }
            }
          }
        }
      }
    }
  }

  try {
    console.time('es')
    const result = await client.search(doc)
    console.timeEnd('es')
    console.log(result.body.hits.total)
  } catch (e) {
    console.error(e.meta.body.error)
  }
}

export default getDocs
