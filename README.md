
```javascript
import defaultAccess from 'data/defaultAccess';


// @ahmedkira
import { setFetcher, setConfig } from '@ahmedkira/custom-table';
import fetcher from 'utils/fetcher';

setConfig({
  PAGINATION_TYPE: 'type1',
});

setFetcher(fetcher);

localStorage.setItem('defaultAccess', JSON.stringify(defaultAccess));
```

```javascript
import CustomTable from '@ahmedkira/custom-table';

<CustomTable ... />

```
