using System.Net.Http.Json;
using WebAPI.Models;

namespace WebAPI.Tests.Integration;

public abstract class IntegrationTestBase(WebApiFactory factory)
{
    protected HttpClient CreateClient() => factory.CreateClient();

    protected async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = CreateClient();
        var email = $"user-{Guid.NewGuid():N}@example.com";
        const string password = "Test1234!";

        var registerResponse = await client.PostAsJsonAsync("/api/register", new { email, password });
        registerResponse.EnsureSuccessStatusCode();

        var loginResponse = await client.PostAsJsonAsync("/api/login?useCookies=true", new { email, password });
        loginResponse.EnsureSuccessStatusCode();

        return client;
    }

    protected static async Task<ProjectDto> CreateProjectAsync(HttpClient client, string name)
    {
        var response = await client.PostAsJsonAsync("/api/projects", new { name });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<ProjectDto>())!;
    }

    protected static async Task<GroupDto> CreateGroupAsync(HttpClient client, int projectId, string name)
    {
        var response = await client.PostAsJsonAsync("/api/groups", new { name, projectId });
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<GroupDto>())!;
    }
}
