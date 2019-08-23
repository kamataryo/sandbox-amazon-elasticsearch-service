import configure from './config'

import { RequestParams } from '@elastic/elasticsearch'

const mapGeoPoint = async () => {
  const { client } = await configure()

  const doc: RequestParams.IndicesCreate = {
    index: 'inat',
    body: {
      mappings: {
        properties: {
          geometry: {
            properties: {
              coordinates: {
                type: 'geo_point'
              }
            }
          }
        }
      }
    }
  }

  try {
    const result = await client.indices.create(doc)
    console.log(result)
  } catch (e) {
    console.error(e.meta.body.error)
  }
}

export default mapGeoPoint
