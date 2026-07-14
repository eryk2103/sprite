namespace WebAPI.Tests.Integration;

[CollectionDefinition(Name)]
public class IntegrationTestCollection : ICollectionFixture<WebApiFactory>
{
    public const string Name = "Integration Tests";
}
