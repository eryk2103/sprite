namespace WebAPI.Data;

public interface IPersistenceContext
{
    Task SaveChangesAsync();
}
