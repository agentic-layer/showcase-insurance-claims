update_settings(max_parallel_updates=10)

# Load .env file for environment variables
load('ext://dotenv', 'dotenv')
dotenv()

v1alpha1.extension_repo(name='agentic-layer', url='https://github.com/agentic-layer/tilt-extensions', ref='v0.3.2')

v1alpha1.extension(name='cert-manager', repo_name='agentic-layer', repo_path='cert-manager')
load('ext://cert-manager', 'cert_manager_install')
cert_manager_install()

v1alpha1.extension(name='agent-runtime', repo_name='agentic-layer', repo_path='agent-runtime')
load('ext://agent-runtime', 'agent_runtime_install')
agent_runtime_install(version='0.10.0')

v1alpha1.extension(name='ai-gateway-litellm', repo_name='agentic-layer', repo_path='ai-gateway-litellm')
load('ext://ai-gateway-litellm', 'ai_gateway_litellm_install')
ai_gateway_litellm_install(version='0.2.0', instance=False)

v1alpha1.extension(name='agent-gateway-krakend', repo_name='agentic-layer', repo_path='agent-gateway-krakend')
load('ext://agent-gateway-krakend', 'agent_gateway_krakend_install')
agent_gateway_krakend_install(version='0.1.4')

# Override Agent resource to use image from spec.image field
# As a consequence, all agents have to specify the image field.
# Unfortunately, Tilt does not currently support using a default/optional image pattern with k8s_kind.
k8s_kind(
    '^Agent$',
    image_json_path='{.spec.image}',
    # Operator creates pods asynchronously after Agent CRD creation and Tilt
    # must wait for operator-managed pods rather than assuming immediate readiness
    pod_readiness='wait',
)

# Apply Kubernetes manifests
k8s_yaml(kustomize('deploy/local'))

# Expose services
k8s_resource('lgtm', port_forwards=['12000:3000'])
k8s_resource('ai-gateway-litellm', port_forwards=['12001:4000'], labels=['agentic-layer'])
k8s_resource('agent-gateway-krakend', port_forwards=['12002:8080'], labels=['agentic-layer'])
k8s_resource('observability-dashboard', port_forwards=['12004:8000'], labels=['agentic-layer'])

k8s_resource('claims-analysis-agent', port_forwards=['12011:8000'], labels=['agents'], resource_deps=['agent-runtime'])
k8s_resource('claims-voice-agent', port_forwards=['12010:8000'], labels=['agents'], resource_deps=['agent-runtime'])
k8s_resource('customer-database', port_forwards=['12020:8000'], labels=['mcp-servers'])
k8s_resource('showcase-claims-frontend', port_forwards='12030:80', labels=['frontend'])

docker_build(
    'claims_voice_agent',
    context='.',
    dockerfile='./agents/Dockerfile',
    build_args={'AGENT_NAME': 'claims_voice_agent'},
)

docker_build(
    'customer_database',
    context='.',
    dockerfile='./mcp-servers/Dockerfile',
    build_args={'MCP_SERVER_NAME': 'customer_database'},
)

docker_build(
    'showcase-claims-frontend',
    context='.',
    dockerfile='./frontend/Dockerfile',
)

google_api_key = os.environ.get('GOOGLE_API_KEY', '')
if not google_api_key:
    warn('GOOGLE_API_KEY environment variable is not set. Please set it in your shell or .env file.')

openai_api_key = os.environ.get('OPENAI_API_KEY', '')
if not openai_api_key:
    warn('OPENAI_API_KEY environment variable is not set. Please set it in your shell or .env file.')

# Create Kubernetes secrets from environment variables
load('ext://secret', 'secret_from_dict')

# Create secret for voice agent, which is not yet using the ai-gateway
k8s_yaml(secret_from_dict(
    name = "api-key-secrets",
    namespace = "showcase-insurance-claims",
    # The ai-gateway expects the API key to be called <provider>_API_KEY
    inputs = { "GEMINI_API_KEY": google_api_key }
))

# Create secret for ai-gateway
k8s_yaml(secret_from_dict(
    name = "api-key-secrets",
    namespace = "ai-gateway",
    # The ai-gateway expects the API key to be called <provider>_API_KEY
    inputs = { "GEMINI_API_KEY": google_api_key, "OPENAI_API_KEY": openai_api_key }
))