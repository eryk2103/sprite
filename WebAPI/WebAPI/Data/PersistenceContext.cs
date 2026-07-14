namespace WebAPI.Data;

public class PersistenceContext(AppDbContext context) : IPersistenceContext
{
    public async Task SaveChangesAsync() => await context.SaveChangesAsync();
}
