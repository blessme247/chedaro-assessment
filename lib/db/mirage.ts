
import { createServer, Model, Factory, belongsTo, hasMany, RestSerializer, Response } from 'miragejs'
import { faker } from '@faker-js/faker'
import { permissions, role, User } from './data.types'


export type Organization = {
  id?: string
  name: string
  members?: User[]
}

export function makeServer(environment = 'development') {
  return createServer({
    environment,

    models: {
      organization: Model.extend({
        // Organization has many users (members)
        users: hasMany(),

      }),
      user: Model.extend({
        // User belongs to an organization
        organization: belongsTo(),
      }),
      // activityLog: Model.extend({
      //   // activityLog belongs to an organization and user
      //   organization: belongsTo(),
      //   user: belongsTo()
      // })
    },
    serializers:{
      organization: RestSerializer.extend({
        include: ["users"],
        embed: true,
        root: false
      }),
       user: RestSerializer.extend({
        include: ["organizations"],
        embed: true
      }),
      activityLog: RestSerializer.extend({
        include: ["organizations", "users"],
        embed: true
      }),
    },

    factories: {
      organization: Factory.extend({
        // id() {
        //   return faker.number.int().toString()
        // },
        name() {
          return faker.string.alpha({ length: { min: 3, max: 40 } })
        },
        // Don't define members here - handle through relationships
      }),

      user: Factory.extend({
        // id() {
        //   return faker.number.int().toString()
        // },
        email() {
          return faker.internet.email()
        },
        password() {
          return faker.internet.password({ length: 12 })
        },
        role() {
          const roles: role[] = ['admin', 'super_admin', 'employee']
          return faker.helpers.arrayElement(roles)
        },
        permissions() {
          // Return a subset of permissions based on role
          const allPermissions = Object.values(permissions)
          const numPermissions = faker.number.int({ min: 1, max: allPermissions.length })
          return faker.helpers.arrayElements(allPermissions, numPermissions)
        },
        // organization_id will be set through relationships
      }),

      activityLog: Factory.extend({
     action() {
          return faker.string.alpha({ length: { min: 4, max: 60 } })
        },
       
        createdAt(){
          return new Date()
        }
      })
    },

    seeds(server) {
      // Create super-admin user (without organization)
      server.create('user', {  organization: null , email: 'super.admin@email.com', password: 'Test@12345', role: 'super_admin', permissions: ['manage_organizations', 'manage_roles', 'manage_teams', 'manage_users', 'view_audit_trail', 'view_organizations', 'view_roles', 'view_teams', 'view_users']})


    // create organization
    const organization = server.create("organization", {name: "Rangers", id: "1"})

    // create user for the organization
    server.create("user", {
      email: 'admin@email.com', password: 'Test@12345',
           permissions: ["manage_teams", "manage_users", "view_users", "view_teams"],
          role: 'admin',
          organization: organization
    })
    },

    routes() {
      this.namespace = 'api'


      // auth routes 
      this.post('/login',(schema:any, request)=> {
        const attrs = JSON.parse(request.requestBody)
        const {email, password} = attrs
        const user =  schema.users.findBy({ email })

      if (!user || (password !== user.attrs.password)) {
      return new Response(
        401,
         { 'Content-Type': 'application/json' },
        { error: 'Invalid email or password' }
      )
    }

        // return user data without password
        const {password: _, ...userWithoutPassword} = user.attrs
        return {
          user: {...userWithoutPassword
        },
        message: "Login successful"
        
      }
        
      })
      

      // Organization routes
      this.get('/organizations', (schema: any) => {
        return schema.organizations.all()
      })

      this.get('/organizations/:id', (schema: any, request) => {
        const id = request.params.id
        return schema.organizations.find(id)
      })

      // Get organization with members
      this.get('/organizations/:id/members', (schema: any, request) => {
        const id = request.params.id
        const organization = schema.organizations.find(id)
        return organization ? organization.members : []
      })

       // Create organization
      this.post('/organizations', (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody)
        console.log(attrs, 'attributes')
          // Validate required fields
    if (!attrs.name) {
      return new Response(
        400,
        { 'Content-Type': 'application/json' },
        { error: 'Organization name is required' }
      )
    }
    
        // return schema.organizations.create(attrs)
          const organization = schema.organizations.create(attrs)
  
  // Log to verify creation
  console.log('Created organization:', organization)
  console.log('All organizations:', schema.organizations.all())
  
  return organization
      })

     

      // User routes
      this.get('/users', (schema: any) => {
        return schema.users.all()
      })

      this.get('/users/:id', (schema: any, request) => {
        const id = request.params.id
        return schema.users.find(id)
      })

      this.get('/users/:email', (schema: any, request) => {
        const email = request.params.email
        return schema.users.findBy(email)
      })

      // Create user and assign to organization
      this.post('/users', (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody)
        // console.log(attrs,'attrs')
        return schema.users.create(attrs)
      })

      // Update user
      this.put('/users/:id', (schema: any, request) => {
        const id = request.params.id
        const attrs = JSON.parse(request.requestBody)
        return schema.users.find(id)?.update(attrs)
      })

      // Delete user
      this.delete('/users/:id', (schema: any, request) => {
        const id = request.params.id
        return schema.users.find(id)?.destroy()
      })

      // Get users by organization
      this.get('/organizations/:id/users', (schema: any, request) => {
        const organizationId = request.params.id
        return schema.users.where({ organizationId })
      })

     

      //  audit trails endpoints
        this.get('/audit-trails', (schema: any) => {
        return schema.activityLogs.all()
      })

      // trails by organization
      this.get('/audit-trails/organization/:id', (schema: any, request)=> {
        let organizationId = request.params.id
        let organization = schema.activityLogs.find(organizationId)
        return organization.activityLogs
      })

      // trails by user
      this.get('/audit-trails/:id', (schema: any, request)=> {
        let userId = request.params.id
        let user = schema.activityLogs.find(userId)
        return user.activityLogs
      })

      // create activityLog 
      this.post('/audit-trails',  (schema: any, request) => {
        const attrs = JSON.parse(request.requestBody)
        return schema.activityLogs.create(attrs)
      })

      this.timing = 200
    },
  })
}