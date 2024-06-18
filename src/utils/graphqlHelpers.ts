import { DocumentNode, TypedDocumentNode, gql as _gql } from "@apollo/client"

export function gql(
  strings: TemplateStringsArray,
  ...values: any[]
): DocumentNode
export function gql<TResult, TVariables>(
  strings: TemplateStringsArray,
  ...values: any[]
): TypedDocumentNode<TResult, TVariables>
export function gql(strings: TemplateStringsArray, ...rest: any[]): any {
  return _gql(strings, ...rest)
}
