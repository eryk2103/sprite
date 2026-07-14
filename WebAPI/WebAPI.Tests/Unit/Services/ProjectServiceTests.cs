using Moq;
using WebAPI.Data;
using WebAPI.Data.Repositories;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Tests.Unit.Services;

public class ProjectServiceTests
{
    private readonly Mock<IProjectRepository> _projectRepository = new();
    private readonly Mock<IPersistenceContext> _persistenceContext = new();
    private readonly ProjectService _sut;

    public ProjectServiceTests()
    {
        _sut = new ProjectService(_projectRepository.Object, _persistenceContext.Object);
    }

    [Fact]
    public async Task GetAllAsync_MapsProjectsToDtosWithPagingInfo()
    {
        var projects = new List<Project>
        {
            new() { Id = 1, Name = "Alpha", UserId = "user-1" },
            new() { Id = 2, Name = "Beta", UserId = "user-1" }
        };
        _projectRepository
            .Setup(r => r.GetPagedForUserAsync("user-1", 1, 20))
            .ReturnsAsync((projects, 5));

        var result = await _sut.GetAllAsync("user-1", 1, 20);

        Assert.Equal(2, result.Items.Count);
        Assert.Equal("Alpha", result.Items[0].Name);
        Assert.Equal(5, result.TotalCount);
        Assert.Equal(1, result.Page);
        Assert.Equal(20, result.PageSize);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenProjectNotFound()
    {
        _projectRepository
            .Setup(r => r.GetDetailForUserAsync(1, "user-1"))
            .ReturnsAsync((Project?)null);

        var result = await _sut.GetByIdAsync(1, "user-1");

        Assert.Null(result);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsDetailDto_WhenProjectFound()
    {
        var project = new Project
        {
            Id = 1,
            Name = "Alpha",
            UserId = "user-1",
            Groups = [new Group { Id = 10, Name = "Group A", ProjectId = 1 }]
        };
        _projectRepository
            .Setup(r => r.GetDetailForUserAsync(1, "user-1"))
            .ReturnsAsync(project);

        var result = await _sut.GetByIdAsync(1, "user-1");

        Assert.NotNull(result);
        Assert.Equal("Alpha", result!.Name);
        Assert.Single(result.Groups);
        Assert.Equal("Group A", result.Groups[0].Name);
    }

    [Fact]
    public async Task CreateAsync_AddsProjectAndSavesChanges()
    {
        var dto = new CreateProjectDto { Name = "New Project" };

        var result = await _sut.CreateAsync("user-1", dto);

        _projectRepository.Verify(r => r.Add(It.Is<Project>(p => p.Name == "New Project" && p.UserId == "user-1")), Times.Once);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
        Assert.Equal("New Project", result.Name);
    }

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenProjectNotFound()
    {
        _projectRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Project?)null);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateProjectDto { Name = "Renamed" });

        Assert.Null(result);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_RenamesProject_WhenFound()
    {
        var project = new Project { Id = 1, Name = "Old", UserId = "user-1" };
        _projectRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(project);

        var result = await _sut.UpdateAsync(1, "user-1", new UpdateProjectDto { Name = "New" });

        Assert.Equal("New", result!.Name);
        Assert.Equal("New", project.Name);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenProjectNotFound()
    {
        _projectRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync((Project?)null);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.False(result);
        _projectRepository.Verify(r => r.Remove(It.IsAny<Project>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_RemovesProject_WhenFound()
    {
        var project = new Project { Id = 1, Name = "Alpha", UserId = "user-1" };
        _projectRepository
            .Setup(r => r.GetForUserAsync(1, "user-1"))
            .ReturnsAsync(project);

        var result = await _sut.DeleteAsync(1, "user-1");

        Assert.True(result);
        _projectRepository.Verify(r => r.Remove(project), Times.Once);
        _persistenceContext.Verify(p => p.SaveChangesAsync(), Times.Once);
    }
}
