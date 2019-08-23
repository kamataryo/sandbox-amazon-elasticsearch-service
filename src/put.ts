import configure from './config'
import axios, { AxiosResponse } from 'axios'
import { transform } from './lib/transform'

import { RequestParams } from '@elastic/elasticsearch'
type Res = AxiosResponse<GeoJSON.FeatureCollection>

const geojsonUrl =
  'https://raw.githubusercontent.com/kamataryo/geojson-samples/master/island-of-biwa-lake.geojson'

const putSample = async () => {
  const { client } = await configure()
  const {
    data: { features }
  }: Res = await axios.get(geojsonUrl)

  try {
    const results = await Promise.all(
      features.map(feature => {
        console.log(transform(feature as GeoJSON.Feature<GeoJSON.Point>))
        const doc: RequestParams.Index = {
          index: 'features',
          body: transform(feature as GeoJSON.Feature<GeoJSON.Point>)
        }
        return client.index(doc)
      })
    )
    console.log(results)
  } catch (e) {
    console.error(e.meta.body.error)
  }
}

putSample()
