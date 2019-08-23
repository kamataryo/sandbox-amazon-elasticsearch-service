import configure from './config'
import { RequestParams } from '@elastic/elasticsearch'

export const deleteDocs = async (ids: string[]) => {
  const { client } = await configure()

  Promise.all(
    ids.map(id => {
      const doc: RequestParams.Delete = {
        index: 'features',
        id
      }
      return client.delete(doc)
    })
  )
}

export default deleteDocs
