
``` mermaid
sequenceDiagram
    User->>Export: Request
    Export ->> /[services]: Request data
    /[services] ->> Export : Retreive data
    Export ->> User: Retreive file
```