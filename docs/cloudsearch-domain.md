# Cloudsearch Domain

Creates a new search domain. For more information, see [Creating a Search Domain](http://docs.aws.amazon.com/cloudsearch/latest/developerguide/creating-domains.html) in the Amazon CloudSearch Developer Guide.

```yaml
CloudsearchDomain:
  Type: Custom::CloudsearchDomain
  Properties:
    ServiceToken: String # Required
    DomainName: String
```

## Properties

See: [CreateDomain](http://docs.aws.amazon.com/goto/WebAPI/cloudsearch-2013-01-01/CreateDomain)

##### ServiceToken

> The service token that was given to the template developer by the service provider to access the service, such as an Amazon SNS topic ARN or Lambda function ARN. The service token must be from the same region in which you are creating the stack.

##### DomainName

> A name for the domain you are creating. Allowed characters are a-z (lower-case letters), 0-9, and hyphen (-). Domain names must start with a letter or number and be at least 3 and no more than 28 characters long.

---

## Return Value

### Ref

When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the ID of the resource, such as `cloudsearch-us-east-1-domain-name`.

### Fn::GetAtt

`DomainId` (String)

> An internally generated unique identifier for a domain.

`ARN` (String)

> The Amazon Resource Name (ARN) of the search domain. See Identifiers for IAM Entities in Using AWS Identity and Access Management for more information.

`DocEndpoint` (String)

> The endpoint to which service requests can be submitted. For example, `search-imdb-movies-oopcnjfn6ugofer3zx5iadxxca.eu-west-1.cloudsearch.amazonaws.com` or `doc-imdb-movies-oopcnjfn6ugofer3zx5iadxxca.eu-west-1.cloudsearch.amazonaws.com`.

`SearchEndpoint` (String)

> The endpoint to which service requests can be submitted. For example, `search-imdb-movies-oopcnjfn6ugofer3zx5iadxxca.eu-west-1.cloudsearch.amazonaws.com` or `doc-imdb-movies-oopcnjfn6ugofer3zx5iadxxca.eu-west-1.cloudsearch.amazonaws.com`.

---

## Examples

The following example creates an identity pool with Facebook enabled. With a configured Identity Provider.

```yaml
CloudsearchDomain:
  Type: Custom::CloudsearchDomain
  Properties:
    ServiceToken: !ImportValue
    DomainName: "my-test-domain"
```
