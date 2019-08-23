import * as AWS from 'aws-sdk'
import { Client } from '@elastic/elasticsearch'

AWS.config.apiVersion = '2015-01-01'

const es = new AWS.ES()
const { AMAZON_ES_DOMAIN_NAME: DomainName } = process.env

export default async () => {
  const {
    DomainStatus: { Endpoint }
  }: AWS.ES.DescribeElasticsearchDomainResponse = await es
    .describeElasticsearchDomain({ DomainName })
    .promise()

  const client = new Client({ node: `http://${Endpoint}` })
  console.log(`http://${Endpoint}`)
  return { client }
}
